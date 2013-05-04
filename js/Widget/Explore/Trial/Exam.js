define(
    [
        'Widget/Explore/Trial/Abstract'
    ],
    function (WidgetExploreTrialAbstract) {
        'use strict';

        var WidgetExploreTrialExam = WidgetExploreTrialAbstract.extend({
            tpl: 'testExam',

            events: function () {
                return _.extend(
                    {},
                    WidgetExploreTrialExam.__super__.events,
                    {
                        'keyup input[type="text"]': function (evt) {
                            if (evt.keyCode == 13) {
                                this.onAnswer(evt);
                            }
                        }
                    }
                );
            },

            retrieveAnswer: function (container) {
                return container.find('input[type="text"]').val().trim();
            },

            next: function (evt) {
                WidgetExploreTrialExam.__super__.next.call(this, evt);

                if (this.currentQuestion < this.cards.length) {
                    this.ui.items.eq(this.currentQuestion).find('input[type="text"]').focus();
                }
            }
        });

        return WidgetExploreTrialExam;
    }
);