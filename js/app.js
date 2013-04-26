define(
    [
        'Chitin',
        'Decks',
        'Preferences',
        'Widget/Root',
        'locale/locale',
        'PredefinedDecks'
    ],

    function (Chitin, Decks, Preferences, WidgetRoot, locale, PredefinedDecks) {
        'use strict';

        var OmniCard = Chitin.Application.extend({
            defaults: {
                immediateStart: false,
                rootNode: '.js-root',
                rootWidget: WidgetRoot
            },

            initialize: function (options) {
                OmniCard.__super__.initialize.call(this, options);

                this.prefs = new this.params.prefs;
                this.pair = this.prefs.getPair();

                this._getLang();
                this.locale = locale[this.lang] || locale.en;

                if (this.pair) {
                    this.prepareDecks(PredefinedDecks[this.pair]);
                }

                this.on('languagesChosen', this.onLang);

                this.start();
            },

            prepareDecks: function (decks) {
                var key = 'deck' + '.' + this.pair;

                this.decks = new this.params.deckClass({
                    key: key,
                    attrs: decks
                });
            },

            onLang: function (data) {
                this.pair = data.native + '-' + data.learn;

                this.prefs.setPair(data);
                this.prefs.set({interface: data.interface});
                this.lang = data.interface;
                this.locale = locale[this.lang];

                this.pair = this.prefs.getPair();

                this.prepareDecks(PredefinedDecks[this.pair]);

                this.trigger('startWork');
            },

            reset: function () {
                this.prefs.reset({silent: true});
                this.decks.reset({silent: true});

                window.location.reload();
            },

            createDeck: function () {
                return this.params.deckClass.createDeck()
            },

            _getLang: function () {
                var lang = this.prefs.get('interface') || window.navigator.userLanguage || window.navigator.language;

                if (lang.indexOf('-') > -1) {
                    lang = lang.split('-')[0]
                }

                this.lang = lang || 'en';
            },

            hideDeck: function (deckId) {
                this.prefs.hideDeck(deckId);
            },
            unhideDeck: function (deckId) {
                this.prefs.unhideDeck(deckId);
            }
        });

        // start the engine
        $(function () {
            window.app = new OmniCard({
                deckClass: Decks,
                prefs: Preferences
            });
        });
    }
);