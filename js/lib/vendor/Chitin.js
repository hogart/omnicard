(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['_', 'jquery', 'exports'], function(_, $, exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Chitin.
            root.Chitin = factory(root, exports, _, $);
        });
    } else {
        // Browser globals
        root.Chitin = factory(root, {}, root._, (root.jQuery || root.Zepto));
  }
}(this, function (root, Chitin, _, $) {
    'use strict';

    /**
     * @author <a href="mailto:doctor.hogart@gmail.com">Konstantin Kitmanov</a>
     * May be freely distributed under the MIT license.
     */

    // conflict management
    var previousChitin = root.Chitin;

    Chitin.noConflict = function () {
        root.Chitin = previousChitin;
        return this;
    };

    // `extend` code below borrowed from Backbone.js. 'Coz it's awesome!

    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Events code below borrowed from Backbone.js. 'Coz it's awesome!

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/,
        slice = [].slice,
        reEventSplitter = /^(\S+)\s*(.*)$/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
        } else if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
        } else {
            return true;
        }
    };

    // Optimized internal dispatch function for triggering events. Tries to
    // keep the usual cases speedy (most Backbone events have 3 arguments).
    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length;
        switch (args.length) {
            case 0:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
                return;
            case 2:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
                return;
            case 3:
                while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
                return;
            default:
                while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
        }
    };

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    var Events = {

        // Bind one or more space separated events, or an events map,
        // to a `callback` function. Passing `"all"` will bind the callback to
        // all events fired.
        on: function (name, callback, context) {
            if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
            this._events || (this._events = {});
            var list = this._events[name] || (this._events[name] = []);
            list.push({callback: callback, context: context, ctx: context || this});
            return this;
        },

        // Bind events to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function (name, callback, context) {
            if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            this.on(name, once, context);
            return this;
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function (name, callback, context) {
            var list, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = {};
                return this;
            }

            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (list = this._events[name]) {
                    events = [];
                    if (callback || context) {
                        for (j = 0, k = list.length; j < k; j++) {
                            ev = list[j];
                            if ((callback && callback !== ev.callback &&
                                callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                                events.push(ev);
                            }
                        }
                    }
                    this._events[name] = events;
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function (name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        // An inversion-of-control version of `on`. Tell *this* object to listen to
        // an event in another object ... keeping track of what it's listening to.
        listenTo: function (obj, name, callback) {
            var listeners = this._listeners || (this._listeners = {});
            var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
            listeners[id] = obj;
            obj.on(name, typeof name === 'object' ? this : callback, this);
            return this;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function (obj, name, callback) {
            var listeners = this._listeners;
            if (!listeners) return;
            if (obj) {
                obj.off(name, typeof name === 'object' ? this : callback, this);
                if (!name && !callback) delete listeners[obj._listenerId];
            } else {
                if (typeof name === 'object') callback = this;
                for (var id in listeners) {
                    listeners[id].off(name, callback, this);
                }
                this._listeners = {};
            }
            return this;
        }
    };

    // Root of hierarchy. Automatically calls initialize method
    // which combines this.defaults and passed options into this.params
    var Abstract = Chitin.Abstract = function (options) {
        this.initialize(options);
    };

    Abstract.prototype = {
        initialize: function (options) {
            this.params = _.extend({}, this.defaults || {}, options || {});
        }
    };

    Abstract.extend = extend;

    // Root «class» with built-in Events.
    var Observable = Chitin.Observable = Abstract.extend();
    _.extend(Observable.prototype, Events);


    var Widget = Chitin.Widget = Observable.extend({
        $: function (selector) {
            return this.$el.find(selector);
        },

        // override this method to change how you find your templates
        _getTplNode: function (tpl) {
            return $('script.js-tpl-' + tpl)
        },

        // override this method to change how do you operate your templates
        getTemplate: function () {
            var tpl = _.result(this, 'tpl');
            if (!tpl) {
                throw new Error('No tpl property defined');
            }

            var tplNode = this._getTplNode(tpl);
            if (tplNode.length !== 1) {
                throw new Error('Invalid tpl selector: "' + tpl + '" — no such nodes or too many.');
            }

            return _.template(tplNode.html());
        },

        render: function (data) {
            this.$el.html(this.template(data));

            this.onRender();
        },

        onRender: function () {
            this.delegateEvents();
            this._ensureUI();
        },

        _delegateEvents: function (events) {
            var emitter = this.$el;
            this._undelegateEvents();

            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) {
                    method = this[events[key]];
                }
                if (!method) {
                    throw new Error('Method "' + events[key] + '" does not exist');
                }
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

        _undelegateEvents: function() {
            this.$el.off('.delegateEvents' + this.cid);
        },

        delegateEvents: function (events) {
            if (!(events || (events = _.result(this, 'events')))) return;

            this._delegateEvents(events);
        },

        delegateBusEvents: function (busEvents) {
            this.stopListening(this.bus);

            if (!(busEvents || (busEvents = _.result(this, 'busEvents')))) return;

            _.each(busEvents, function (method, eventName) {
                var fn;

                if (_.isFunction(method)) {
                    fn = method
                } else if (_.isString(method) && this[method]) {
                    fn = this[method]
                } else {
                    throw new Error('Method "' + method + '" does not exist or invalid')
                }

                this.listenTo(this.bus, eventName, fn)
            }, this);
        },

        ensureSubWidgets: function (subWidgets) {
            if (!(subWidgets || (subWidgets = _.result(this, 'subWidgets')))) return;

            var cls,
                options;
            _.each(subWidgets, function (widgetClass, selector) {
                if (_.isArray(widgetClass)) {
                    cls = widgetClass[0];
                    options = {};

                    if (_.isFunction(widgetClass[1])) {
                        options = widgetClass[1].call(this)
                    } else if (_.isString(widgetClass[1])) {
                        options = this[widgetClass[1]]
                    }
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
            this.children[selector] = new widgetClass(
                _.extend({
                    el: this.$(selector),
                    bus: this.bus
                }, options)
            );
        },

        unregisterChild: function (name) {
            var child = this.children[name];
            if (child) {
                child.destroy();
                delete this.children[name];
            }
        },

        initialize: function(options) {
            Widget.__super__.initialize.call(this, options);

            this.cid = _.uniqueId('widget');
            this.$el = $(options.el);
            this.template = this.getTemplate();

            this.bus = this.params.bus;
            this.delegateEvents();
            this.delegateBusEvents();

            this.children = {};
        },

        destroy: function () {
            this._undelegateEvents();
            this.off();
            this.stopListening();

            _.each(this.children, function (child, name) {
                this.unregisterChild(name);
            }, this);

            this.$el.html('');
        }
    });

    var Application = Chitin.Application = Observable.extend({
        defaults: {
            immediateStart: true,
            rootWidget: Widget,
            rootNode: 'html'
        },

        initialize: function (options) {
            Application.__super__.initialize.call(this, options);

            this.params.immediateStart && this.start();
        },

        start: function () {
            this.root = new this.params.rootWidget({
                bus: this,
                el: this.params.rootNode
            });

            return this;
        }
    });

    return Chitin;
}));