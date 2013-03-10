(function () {
    'use strict';
 
    /**
     * @author <a href="mailto:doctor.hogart@gmail.com">Konstantin Kitmanov</a>
     * May be freely distributed under the MIT license.
     */
 
    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;
    
      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }
    
      // Add static properties to the constructor function, if supplied.
      _.extend(child, parent, staticProps);
    
      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;
    
      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) _.extend(child.prototype, protoProps);
    
      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;
    
      return child;
    };
        
    var reEventSplitter = /^(\S+)\s*(.*)$/;
    
    var SimpleWidget = function (node, options) {
        this.initialize(node, options);
    };
    
    SimpleWidget.prototype = {
        $: function (selector) {
            return this.$el.find(selector);
        },

        getTemplate: function () {
            var tplNode = $('script.js-tpl-' + this.tpl ),
                tplText = tplNode.text();
    
            return _.template(tplText);
        },
    
        render: function (data) {
            this.$el.html(this.getTemplate()(data));

            this.onRender();
        },

        onRender: function () {
            this.delegateEvents();
            this._ensureUI();
        },

        _delegateEvents: function(events, emitter) {
          this._undelegateEvents(emitter);
          for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) throw new Error('Method "' + events[key] + '" does not exist');
            var match = key.match(reEventSplitter),
                eventName = match[1],
                selector = match[2];
            method = _.bind(method, this);
            eventName += '.delegateEvents' + this.cid;
            if (selector === '') {
              emitter.on(eventName, method);
            } else {
              emitter.on(eventName, selector, method);
            }
          }
        },
    
        _undelegateEvents: function(emitter) {
          emitter.off('.delegateEvents' + this.cid);
        },
    
        delegateEvents: function (events) {
            if (!(events || (events = _.result(this, 'events')))) return;
    
            this._delegateEvents(events, this.$el);
        },
    
        delegateBusEvents: function (busEvents) {
            if (!(busEvents || (busEvents = _.result(this, 'busEvents')))) return;
    
            this._delegateEvents(busEvents, this.bus);
        },

        ensureSubWidgets: function (subWidgets) {
            if (!(subWidgets || (subWidgets = _.result(this, 'subWidgets')))) return;

            var cls,
                options;
            _.each(subWidgets, function (widgetClass, selector) {
                if (_.isArray(widgetClass)) {
                    cls = widgetClass[0];
                    options = widgetClass[1];
                } else {
                    cls = widgetClass;
                    options = {};
                }
                this.registerChild(selector, cls, options);
            }, this);
        },

        _ensureUI: function (ui) {
            ui || (ui = _.result(this, '_ui'));

            if (!ui) { // nothing to do here anymore
                return;
            }

            this.ui = {};

            _.each(ui, function (selector, name) {
                this.ui[name] = this.$(selector);
            }, this)
        },

        registerChild: function (selector, widgetClass, options) {
            this.children[selector] = new widgetClass(this.$(selector), options || {});
        },

        unregisterChild: function (name) {
            var child = this.children[name];
            if (child) {
                child.destroy();
                delete this.children[name];
            }
        },

        initialize: function(node, options) {
            this.cid = _.uniqueId('widget');
            this.$el = node;
            this.$ = node.find.bind(node);
            this.template = this.getTemplate();

            options || (options = {});
            this.options = _.extend(node.ondblclick ? node.ondblclick() : {}, options);

            this.params = _.extend({}, this.defaults, this.options);
    
            this.bus = $(document);
            this.delegateEvents();
            this.delegateBusEvents();

            this.children = {};
        },

        destroy: function () {
            this._undelegateEvents(this.$el);
            this._undelegateEvents(this.bus);

            _.each(this.children, function (child, name) {
                this.unregisterChild(name);
            }, this);

            this.$el.html('');
        }
    };

    SimpleWidget.extend = extend;

    // conflict management — save link to previous content of SimpleWidget, whatever it was.
    var root = this,
        prevName = root.SimpleWidget;
 
    /**
     * Cleans global namespace, restoring previous value of window.SimpleWidget, and returns SimpleWidget itself.
     * @return {SimpleWidget}
     */
    SimpleWidget.noConflict = function () {
        root.SimpleWidget = prevName;
        return this;
    };
 
    // Expose our precious function to outer world.
    if (typeof define === 'function' && define.amd) { // requirejs/amd env
        define(
            ['underscore'],
            function (_) {
                return SimpleWidget;
            }
        );
    } else { // plain browser environment
        root.SimpleWidget = SimpleWidget;
    }
}).call(this);