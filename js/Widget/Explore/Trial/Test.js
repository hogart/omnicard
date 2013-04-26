define(
    [
        'Widget/Explore/Trial/Abstract',
        '_'
    ],
    function (WidgetExploreTrialAbstract, _) {
        'use strict';

        var WidgetTrialTest = WidgetExploreTrialAbstract.extend({
            tpl: 'testTest',

           /**
            * Returns `amount` random unique entries from `arr`, excluding `excludeIndex`
            * @param {Array} arr
            * @param {Number} amount
            * @param {Number} excludeIndex
            * @return {Array}
            * @private
            */
            _randEntries: function(arr, amount, excludeIndex) {
                var result = [],
                    randoms = [],
                    maxRand = arr.length - 1,
                    rand;

                for (var i = 0; i < amount; i++) {
                    do {
                        rand = _.random(0, maxRand);
                    } while (_.contains(randoms, rand) || rand == excludeIndex);

                    result.push(arr[rand])
                }

                return result;
            },

            rr: function () {
                var randEntries = this._randEntries,
                    cards = this.cards,
                    tests = _.map(cards, function (card, index ) {
                        var test = {
                                q: card.q
                            },
                            answers = _.pluck(randEntries(cards, 3, index), 'a');

                        answers.push(card.a);

                        test.a = _.shuffle(answers);

                        return test;
                    });

                this.render({
                    name: this.name,
                    cards: tests,
                    currentQuestion: this.currentQuestion
                })
            },

            retrieveAnswer: function (container) {
                return container.find('input:checked').val();
            }
        });

        return WidgetTrialTest;
    }
);