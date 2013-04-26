define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        'use strict';

        var WidgetStart = WidgetAbstract.extend({
            tpl: 'start',

            _ui: {
                toggled: '.js-content, .js-hide, .js-show'
            },

            events: {
                'click button': 'triggerVerbosity'
            },

            initialize: function (options) {
                WidgetStart.__super__.initialize.call(this, options);

                this.verbosity = this.bus.prefs.get('showHelp', true);

                this.render({
                    verbosity: this.verbosity
                });
            },

            triggerVerbosity: function () {
                this.verbosity = !this.verbosity;

                this.ui.toggled.toggleClass('hidden');

                this.bus.prefs.set({showHelp: this.verbosity});
            }
        });

        return WidgetStart;
    }
);