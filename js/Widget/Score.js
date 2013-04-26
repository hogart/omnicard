define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        'use strict';

        var WidgetScore = WidgetAbstract.extend({
            tpl: 'score',

            initialize: function (options) {
                WidgetScore.__super__.initialize.call(this, options);

                this.render({
                    congrats: this.params.congrats,
                    wrong: this.params.wrong,
                    correct: this.params.correct,
                    testable: this.params.testable,
                    corrections: this.params.corrections
                });
            }
        });

        return WidgetScore;
    }
);