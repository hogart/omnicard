define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        var WidgetLangSelect = WidgetAbstract.extend({
            tpl: 'langSelect',

            initialize: function (options) {
                WidgetLangSelect.__super__.initialize.call(this, options);

                this.render({
                    lang: this.bus.lang,
                    langs: {
                        en: 'English',
                        ru: 'Русский'
                    }
                });
            }
        });

        return WidgetLangSelect;
    }
);