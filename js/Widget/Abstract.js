define(
    [
        'Chitin',
        '_'
    ],
    function (Chitin, _) {
        var widgetPrototype = {
            render: function (data) {
                var bus = this.bus,
                    prefAttrs = bus.prefs.attrs,
                    pair = prefAttrs.pair,

                    commons = {
                        locale: bus.locale,
                        lang: {
                            'interface': prefAttrs.interface,
                            learn: pair ? pair.learn : '',
                            native: pair ? pair.native : ''
                        }
                    };

                data = _.extend(
                    data,
                    commons
                );

                WidgetAbstract.__super__.render.call(this, data);
            }
        };

        if ('ontouchend' in document) {
            widgetPrototype.delegateEvents = function (events) {
                if (!(events || (events = _.result(this, 'events')))) return;

                var touchEvents = {};
                _.each(events, function (value, key) {
                    var k = key;
                    if (key.substr(0, 6) == 'click ') {
                        k = key.replace(/^click /, 'touchend ');
                    }

                    touchEvents[k] = value
                });

                this._delegateEvents(touchEvents);
            }
        }

        /**
         * @class
         */
        var WidgetAbstract = Chitin.Widget.extend(widgetPrototype);

        return WidgetAbstract;
    }
);