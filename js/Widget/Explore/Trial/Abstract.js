define(
    [
        'Widget/Explore/Abstract'
    ],
    function (WidgetExploreAbstract) {
        'use strict';

        var WidgetTrialAbstract = WidgetExploreAbstract.extend({
            events: {
                'click .js-answer': 'onAnswer',
                'click .js-skip': 'onSkip',
                'click .js-next': 'next'
            },

            initialize: function (options) {
                this.correct = 0;
                this.wrong = 0;

                WidgetTrialAbstract.__super__.initialize.call(this, options);

                this.showCorrections = this.bus.prefs.get('showCorrections');
                this.corrections = [];
            },

            isCorrect: function (answer, correctAnswer) {
                if (this.caseSensitive) {
                    return answer == correctAnswer
                } else {
                    return answer.toLowerCase() == correctAnswer.toLowerCase()
                }
            },

            onAnswer: function (evt) {
                var trgt = $(evt.target),
                    li = trgt.closest('li'),
                    answer = this.retrieveAnswer(li),
                    correctAnswer = this.cards[this.currentQuestion].a;

                if (this.isCorrect(answer, correctAnswer)) {
                    this.correct++;
                    this.next();
                } else {
                    this.wrong++;

                    if (this.showCorrections) {
                        li.find('.js-correction').html(correctAnswer).removeClass('hidden');
                        li.find('.js-next').removeClass('hidden');
                        li.find('.js-answerBlock').addClass('hidden');
                        this.corrections.push({
                            q: this.cards[this.currentQuestion].q,
                            a: this.cards[this.currentQuestion].a,
                            w: answer
                        });
                    } else {
                        this.next();
                    }
                }
            },

            onSkip: function () {
                this.wrong++;

                this.next();
            },

            final: function () {
                var params = {
                    wrong: this.wrong,
                    correct: this.correct
                };

                if (this.corrections.length) {
                    params.corrections = this.corrections
                }

                this.$el.trigger('testComplete', params);
            }
        });

        return WidgetTrialAbstract;
    }
);