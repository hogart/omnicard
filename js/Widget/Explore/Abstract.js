define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        'use strict';

        var WidgetExploreAbstract = WidgetAbstract.extend({
            _ui: {
                items: '.js-card',
                progress: '.js-progress'
            },

            initialize: function (options) {
                WidgetExploreAbstract.__super__.initialize.call(this, options);

                this.currentQuestion = 0;

                this.cards = _.shuffle(_.cloneDeep(this.params.deck.content));
                this.name = this.params.deck.name;

                this.rr();
            },

            rr: function () {
                this.render({
                    name: this.name,
                    cards: this.cards,
                    current: this.currentQuestion,
                    showExamples: this.bus.prefs.get('showExamples')
                });
                this._renderProgress();
            },

            /**
             * @protected
             */
            _renderProgress: function () {
                var width = 1;

                width += Math.ceil(this.currentQuestion / this.cards.length * 99);

                this.ui.progress.css({
                    width: width + '%'
                });

                this.ui.progress.text(this.currentQuestion + '/' + this.cards.length)
            },

            next: function () {
                this.ui.items.eq(this.currentQuestion).addClass('hidden');

                this.currentQuestion++;

                this._renderProgress();

                if (this.currentQuestion == this.cards.length) {
                    this.final();
                }

                this.ui.items.eq(this.currentQuestion).removeClass('hidden');
            }
        });

        return WidgetExploreAbstract;
    }
);