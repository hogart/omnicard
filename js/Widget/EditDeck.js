define(
    [
        'Widget/Abstract',
        '_',
        'lib/vendor/jquery.form2JSON'
    ],
    function (WidgetAbstract, _) {
        'use strict';

        var WidgetEditDeck = WidgetAbstract.extend({
            tpl: 'editDeck',

            _ui: {
                frm: 'form',
                cardList: '.js-cardList',
                newQuestion: '.js-addCard .js-question',
                newAnswer: '.js-addCard .js-answer',
                newExample: '.js-addCard .js-example',

                dumpDeck: '.js-dumpDeck',
                dumpDeckDumpster: '.js-dumpDeck .js-dumpster',
                dumpDeckTA: '.js-dumpDeck textarea',
                dumpDeckDone: '.js-dumpDeck .js-done',

                dumpCards: '.js-dumpCards',
                dumpCardsDumpster: '.js-dumpCards .js-dumpster',
                dumpCardsTA: '.js-dumpCards textarea',
                dumpCardsDone: '.js-dumpCards .js-done'
            },

            events: {
                'submit form': 'onSubmit',
                'reset form': 'onReset',
                'click .js-confirm': 'addCard',
                'click .js-deleteCard': 'deleteCard',

                'click .js-dump .js-import, .js-dump .js-export': 'toggleDumpster',
                'click .js-dump .js-done': 'doneDumpster'
            },

            initialize: function (options) {
                WidgetEditDeck.__super__.initialize.call(this, options);

                this.deck = this.params.deck ? this.params.deck[1] : this.bus.createDeck();
                this.id = this.params.deck ? this.params.deck[0] : null;

                this.renderDeck();
            },

            renderDeck: function () {
                var tplData = {
                    deck: this.deck
                };

                tplData.cardsDump = _.map(this.deck.content, function (card) {
                    return card.q + '\t' + card.a
                }).join('\n');

                this.render(tplData);
            },

            onSubmit: function (evt) {
                evt.preventDefault();

                var deckRaw = this.ui.frm.form2JSON({
                    tags: function (tags) {
                        return _.map(tags.split(','), function (tag) {
                            return tag.trim()
                        })
                    }
                });

                deckRaw.testable = !!deckRaw.testable;

                deckRaw.content = [];
                _.each(deckRaw.cardq, function (cardQuestion, index) {
                    var q = cardQuestion.trim(),
                        a = deckRaw.carda[index].trim(),
                        eg = deckRaw.cardeg[index].trim(),
                        card = {};

                    if (q && a) {
                        card.q = q;
                        card.a = a;
                        eg && (card.eg = eg);

                        deckRaw.content.push(card);
                    }
                });

                var deckContent = _.pick(deckRaw, ['name', 'description', 'tags', 'content']);
                if (_.isNull(this.id)) {
                    this.bus.decks.attrs.push(deckContent);
                    this.bus.decks.set({}); // trick to force save
                } else {
                    var deck = {};
                    deck[this.id] = deckContent;

                    this.bus.decks.set(deck);
                }

                this.bus.decks.trigger('update');

                this.bus.trigger('displayStart');
            },

            onReset: function (evt) {
                evt.preventDefault();

                this.renderDeck();

                return false;
            },

            addCard: function () {
                var newCard = this.$('.js-cardTemplate').clone();
                newCard.find('.js-question').val( this.ui.newQuestion.val() );
                newCard.find('.js-answer').val( this.ui.newAnswer.val() );
                newCard.find('.js-example').val( this.ui.newExample.val() );

                newCard.appendTo(this.ui.cardList).removeClass('hidden js-cardTemplate');

                this.ui.newQuestion.val('');
                this.ui.newAnswer.val('');
                this.ui.newExample.val('');
            },

            deleteCard: function (evt) {
                var trgt = $(evt.target),
                    card = trgt.closest('.js-cardForm');

                card.remove();
            },

            toggleDumpster: function (evt) {
                var trgt = $(evt.target),
                    dumpster = trgt.closest('.js-dump').find('.js-dumpster');

                trgt.toggleClass('active');
                dumpster.toggleClass('hidden');
            },

            doneDumpster: function (evt) {
                var trgt = $(evt.target),
                    container = trgt.closest('.js-dump'),
                    ta = container.find('textarea'),
                    isDeck = container.hasClass('js-dumpDeck');

                var content = ta.val().trim();

                if (!content) {
                    this.toggleDumpster(evt);
                    return;
                } else {
                    if (isDeck) {
                        var deckData;
                        try {
                            deckData = JSON.parse(content);
                        } catch (e) {
                            alert(this.bus.locale.invalidFormat);
                            return
                        }

                        this.deck = _.extend(this.deck, deckData);
                    } else {
                        var cards = _.map(content.split('\n'), function (line) {
                            var parts = line.split(/\t|    /mg);
                            return {
                                q: parts[0],
                                a: parts[1]
                            }
                        });

                        this.deck.content = _.extend(this.deck.content, cards);
                    }

                    this.renderDeck();

                    return;
                }
            }
        });

        return WidgetEditDeck;
    }
);