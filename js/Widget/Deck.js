define(
    [
        'Widget/Abstract',
        'Widget/Explore/Meditation',
        'Widget/Explore/Trial/Test',
        'Widget/Explore/Trial/Exam',
        'Widget/Score'
    ],
    function (WidgetAbstract, WidgetExploreMeditation, WidgetExploreTrialTest, WidgetExploreTrialExam, WidgetScore) {
        'use strict';

        var WidgetDeck = WidgetAbstract.extend({
            tpl: 'deck',

            events: {
                'click .js-startMeditation': 'onStartMeditation',
                'click .js-startTest': 'onStartTest',
                'click .js-startExam': 'onStartExam',

                'change [name="showCorrections"]': 'onShowCorrectionsChange',
                'change [name="showExamples"]': 'onShowExamplesChange',

                'meditationOver .js-test': 'onMeditationComplete',
                'testComplete .js-test': 'onTestComplete',

                'click .js-editDeck': 'onEditDeck',
                'click .js-deleteDeck': 'onDeleteDeck',
                'click .js-hideDeck': 'onHideDeck',
                'click .js-addCard': 'onAddCard',

                'click .js-confirmAdd': 'addCard'
            },

            _ui: {
                score: '.js-score',
                showCorrections: '[name="showCorrections"]',
                showExamples: '[name="showExamples"]',
                addCardForm: '.js-addCardForm',
                addCardBtn: '.js-addCard'
            },

            initialize: function (options) {
                WidgetDeck.__super__.initialize.call(this, options);

                this.deck = this.params.deck[1]; // deck is sent as [id, deckObject]
                this.testable = this.deck.testable && this.deck.content.length > 3;

                this.rr();
            },

            rr: function () {
                this.render({
                    deck: this.deck,
                    testable: this.testable,
                    showCorrections: this.bus.prefs.get('showCorrections'),
                    showExamples: this.bus.prefs.get('showExamples')
                });

                this.setState('browsing');
            },

            onStartMeditation: function () {
                this.displayExercise(WidgetExploreMeditation);
            },

            onStartTest: function () {
                this.displayExercise(WidgetExploreTrialTest);
            },

            onStartExam: function () {
                this.displayExercise(WidgetExploreTrialExam);
            },

            onMeditationComplete: function (evt) {
                this.setState('scoring');
                this.displayScore({congrats: true, testable: this.testable});
            },

            onTestComplete: function (evt, data) {
                this.setState('scoring');
                data.testable = this.testable;
                this.displayScore(data);
            },

            onEditDeck: function () {
                this.bus.trigger('editDeck', this.params.deck)
            },

            onDeleteDeck: function () {
                this.bus.trigger('deleteDeck', this.params.deck);
            },

            onHideDeck: function () {
                this.bus.trigger('hideDeck', this.params.deck);
            },

            setState: function (state) {
                this.$el.removeClass('deckView__browsing deckView__testing deckView__scoring');
                this.$el.addClass('deckView__' + state);
            },

            displayScore: function (params) {
                this.unregisterChild('.js-score');
                this.registerChild('.js-score', WidgetScore, params);
            },

            displayExercise: function (type) {
                this.setState('testing');
                this.unregisterChild('.js-test');
                this.registerChild(
                    '.js-test',
                    type,
                    {
                        deck: this.deck
                    }
                );
            },

            onShowCorrectionsChange: function (evt) {
                this.bus.prefs.set({showCorrections: this.ui.showCorrections.is(':checked')})
            },

            onShowExamplesChange: function (evt) {
                this.bus.prefs.set({showExamples: this.ui.showExamples.is(':checked')})
            },

            onAddCard: function () {
                this.ui.addCardForm.toggleClass('hidden');
                this.ui.addCardBtn.toggleClass('active');
            },

            addCard: function () {
                var find = this.ui.addCardForm.find.bind(this.ui.addCardForm),
                    q = find('.js-question').val().trim(),
                    a = find('.js-answer').val().trim(),
                    eg = find('.js-example').val().trim(),

                    newCard = {};

                if (q && a) {
                    newCard.q = q;
                    newCard.a = a;
                    eg && (newCard.eg = eg);

                    this.deck.content.push(newCard);
                    this.bus.decks.set({});
                    this.rr();
                } else {
                    alert(this.bus.locale.invalidCard);
                }
            }
        });

        return WidgetDeck;
    }
);