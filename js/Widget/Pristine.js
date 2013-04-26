define(
    [
        'Widget/Abstract',
        'Widget/LangSelect',
        'jquery.form2JSON'
    ],
    function (WidgetAbstract, WidgetLangSelect) {
        'use strict';

        var Pristine = WidgetAbstract.extend({
            tpl: 'pristine',

            events: {
                'submit form': 'onSubmit'
            },

            subWidgets: {
                '.js-changeLang': WidgetLangSelect
            },

            initialize: function (options) {
                Pristine.__super__.initialize.call(this, options);

                this.render({});
                this.ensureSubWidgets();
            },

            onSubmit: function (evt) {
                evt.preventDefault();

                var data = this.$('form').form2JSON();

                this.bus.trigger('languagesChosen', data);
            }
        });

        return Pristine;
    }
);