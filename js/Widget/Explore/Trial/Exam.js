define(
    [
        'Widget/Explore/Trial/Abstract'
    ],
    function (WidgetExploreTrialAbstract) {
        'use strict';

        var WidgetExploreTrialExam = WidgetExploreTrialAbstract.extend({
            tpl: 'testExam',

            _ui: function () {
                return _.extend(
                    {},
                    WidgetExploreTrialExam.__super__._ui,
                    {
                        qHeader: '.js-qHeader',
                        input: 'input[type="text"]',
                        correction: '.js-correction',
                        next: '.js-next',
                        answerBlock: '.js-answerBlock'
                    }
                );
            },

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

            retrieveAnswer: function () {
                return this.ui.input.val().trim();
            },

            renderCorrection: function (container, answer, correctAnswer) {
                this.ui.correction.html(correctAnswer).removeClass('hidden');
                this.ui.next.removeClass('hidden');
                this.ui.answerBlock.addClass('hidden');
                this.corrections.push({
                    q: this.cards[this.currentQuestion].q,
                    a: this.cards[this.currentQuestion].a,
                    w: answer
                });
            },

            next: function (evt) {
                this.currentQuestion++;

                this._renderProgress();

                if (this.currentQuestion == this.cards.length) {
                    this.final();
                } else {
                    this.ui.qHeader.text(this.cards[this.currentQuestion].q);
                    this.ui.input.val('');
                    this.ui.input.focus();

                    this.ui.correction.html('').addClass('hidden');
                    this.ui.next.addClass('hidden');
                    this.ui.answerBlock.removeClass('hidden');
                }
            }
        });

        return WidgetExploreTrialExam;
    }
);