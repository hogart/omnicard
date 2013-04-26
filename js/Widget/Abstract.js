define(
    [
        'Chitin',
        '_'
    ],
    function (Chitin, _) {
        var WidgetAbstract = Chitin.Widget.extend({
            render: function (data) {
                data = _.extend(data, {locale: this.bus.locale});

                WidgetAbstract.__super__.render.call(this, data);
            }
        });

        return WidgetAbstract;
    }
);