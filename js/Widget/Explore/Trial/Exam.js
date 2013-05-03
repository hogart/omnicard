define(
    [
        'Widget/Explore/Trial/Abstract'
    ],
    function (WidgetTrialAbstract) {
        'use strict';

        var WidgetTrialExam = WidgetTrialAbstract.extend({
            tpl: 'testExam',

            retrieveAnswer: function (container) {
                return container.find('input[type="text"]').val().trim();
            }
        });

        return WidgetTrialExam;
    }
);