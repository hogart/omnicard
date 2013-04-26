define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        'use strict';

        var WidgetNav = WidgetAbstract.extend({
            tpl: 'nav',

            events: {
                'click .js-deckItem': 'onDeckClick',
                'click .js-addDeck': 'onAddDeck',
                'click .js-settingsItem': 'onSettings',
                'click .js-decksItem': 'onDeckList'
            },

            initialize: function (options) {
                WidgetNav.__super__.initialize.call(this, options);

                this.listenTo(this.bus.decks, 'update', this.rr);

                this.rr();
            },

            rr: function () {
                this.decks = this.params.decks.attrs;

                this.render({
                    hiddenDecks: this.bus.prefs.attrs.hiddenDecks,
                    decks: this.decks
                });
            },

            onDeckClick: function (evt) {
                var target = $(evt.target ),
                    index = target.index() - 1,
                    deck = [index, this.decks[index]];

                this.bus.trigger('displayDeck', deck);
            },

            onAddDeck: function () {
                this.bus.trigger('addDeck');
            },

            onSettings: function () {
                this.bus.trigger('displaySettings');
            },

            onDeckList: function () {
                this.bus.trigger('displayDecks');
            }
        });

        return WidgetNav;
    }
);