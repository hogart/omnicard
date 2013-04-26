define(
    [
        'Widget/Abstract',
        'Widget/LangSelect'
    ],
    function (WidgetAbstract, WidgetLangSelect) {
        'use strict';

        var WidgetSettings = WidgetAbstract.extend({
            tpl: 'settings',

            events: {
                'click .js-dump': function () { this.bus.trigger('displayDump') },
                'click .js-reset': 'onResetClick',
                'click .js-changeLang': 'onChangeLang'
            },

            subWidgets: {
                '.js-langSelect': WidgetLangSelect
            },

            initialize: function (options) {
                WidgetSettings.__super__.initialize.call(this, options);

                this.render({});
                this.ensureSubWidgets();
            },

            onResetClick: function () {
                if (confirm(this.bus.locale.confirmClearAll)) {
                    this.bus.reset();
                }
            },

            onChangeLang: function () {
                var lang = this.$('[name="interface"]').val();
                this.bus.prefs.set({interface: lang});
                window.location.reload();
            }
        });

        return WidgetSettings;
    }
);