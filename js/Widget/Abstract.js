define(
    [
        'Chitin',
        '_'
    ],
    function (Chitin, _) {
        var WidgetAbstract = Chitin.Widget.extend({
            render: function (data) {
                var bus = this.bus,
                    prefAttrs = bus.prefs.attrs,
                    pair = prefAttrs.pair;

                data = _.extend(
                    data,
                    {
                        locale: bus.locale,
                        lang: {
                            'interface': prefAttrs.interface,
                            learn: pair ? pair.learn : '',
                            native: pair ? pair.native : ''
                        }
                    }
                );

                WidgetAbstract.__super__.render.call(this, data);
            }
        });

        return WidgetAbstract;
    }
);