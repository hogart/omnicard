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
                'click .js-decksItem': 'onDeckList',
                'click .js-help': 'onHelp'
            },

            initialize: function (options) {
                WidgetNav.__super__.initialize.call(this, options);

                this.listenTo(this.bus.decks, 'update', this.rr);

                this.active = false;

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
                evt.preventDefault();

                var target = $(evt.target).closest('li'),
                    index = parseInt(target.attr('data-id')),
                    deck = [index, this.decks[index]];

                this._toggleDD(false);
                this.bus.trigger('displayDeck', deck);
            },

            onAddDeck: function (evt) {
                evt.preventDefault();

                this._toggleDD(false);
                this.bus.trigger('addDeck');
            },

            onSettings: function (evt) {
                evt.preventDefault();

                this._toggleDD(false);
                this.bus.trigger('displaySettings');
            },

            onDeckList: function (evt) {
                evt.preventDefault();

                var target = $(evt.target).closest('.js-decksItem');

                if (target.hasClass('js-header')) {
                    if (document.documentElement.clientWidth >= 980) {
                        this.bus.trigger('displayDecks');
                    } else {
                        this._toggleDD(!this.active);
                    }
                } else {
                    this._toggleDD(false);
                    this.bus.trigger('displayDecks');
                }
            },

            onHelp: function (evt) {
                evt.preventDefault();

                this._toggleDD(false);
                this.bus.trigger('displayStart');
            },

            _toggleDD: function (show) {
                this.active = !!show;
                this.$el.toggleClass('active', !!show);
            }
        });

        return WidgetNav;
    }
);