define(
    [
        'Widget/Abstract',
        'Widget/Pristine',
        'Widget/Nav',
        'Widget/Start',
        'Widget/EditDeck',
        'Widget/DeckList',
        'Widget/Deck',
        'Widget/Settings',
        'Widget/Dump'
    ],
    function (WidgetAbstract, WidgetPristine, WidgetNav, WidgetStart, WidgetEditDeck, WidgetDeckList, WidgetDeck, WidgetSettings, WidgetDump) {
        'use strict';

        var WidgetRoot = WidgetAbstract.extend({
            tpl: 'root',

            startWidgets: {
                '.js-pristine': WidgetPristine
            },

            workWidgets: {
                '.js-nav': [WidgetNav, function () { return {decks: this.bus.decks } }],
                '.js-start': WidgetStart
            },

            busEvents: {
                'startWork': 'startWork',

                'displayStart': 'displayStart',
                'displayDeck': 'displayDeck',
                'editDeck': 'editDeck',
                'addDeck': 'editDeck',
                'deleteDeck': 'deleteDeck',
                'hideDeck': 'hideDeck',
                'displayDump': 'displayDump',
                'displaySettings': 'displaySettings',
                'displayDecks': 'displayDecks'
            },

            initialize: function (options) {
                WidgetRoot.__super__.initialize.call(this, options);
                this.render({});

                if (this.bus.pair) {
                    this.startWork();
                } else {
                    this.ensureSubWidgets(this.startWidgets);
                    this.$el
                        .removeClass('root__work')
                        .addClass('root__pristine');
                }
            },

            startWork: function () {
                this.ensureSubWidgets(this.workWidgets);
                this.$el
                    .removeClass('root__pristine')
                    .addClass('root__work');
            },

            _clearScreen: function () {
                this.unregisterChild('.js-pristine');
                this.unregisterChild('.js-start');
                this.unregisterChild('.js-deck');
                this.unregisterChild('.js-deckList');
                this.unregisterChild('.js-edit');
                this.unregisterChild('.js-settings');
                this.unregisterChild('.js-dump');
            },

            displayStart: function () {
                this._clearScreen();
                this.registerChild('.js-start', WidgetStart, {});
            },

            editDeck: function (deck) {
                this._clearScreen();
                this.registerChild('.js-edit', WidgetEditDeck, {deck: deck});
            },

            deleteDeck: function (deck) {
                if (confirm(this.bus.locale.deleteDeckConfirm)) {
                    this.bus.decks.deleteDeck(deck[0]);
                    this._clearScreen();
                }
            },

            hideDeck: function (deck) {
                if (confirm(this.bus.locale.hideDeckConfirm)) {
                    this.bus.hideDeck(deck[1].id);
                    this._clearScreen();
                }
            },

            displayDecks: function () {
                this._clearScreen();
                this.registerChild('.js-deckList', WidgetDeckList, {});
            },

            displayDeck: function (deck) {
                this._clearScreen();
                this.registerChild('.js-deck', WidgetDeck, {deck: deck});
            },

            displaySettings: function () {
                this._clearScreen();
                this.registerChild('.js-settings', WidgetSettings, {});
            },

            displayDump: function () {
                this._clearScreen();
                this.registerChild('.js-dump', WidgetDump, {});
            }
        });

        return WidgetRoot;
    }
);