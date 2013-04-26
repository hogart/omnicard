define(
    [
        'Storable',
        'Storage'
    ],
    function (Storable, Storage) {
        /**
         * @extends {Storable}
         * @class Preferences
         */
        var Preferences = Storable.extend({
            defaults: {
                key: 'prefs',
                storage: Storage,
                attrs: {
                    showCorrections: true,
                    hiddenDecks: {}
                }
            },

            getPair: function () {
                var pair = this.attrs.pair;
                if (!pair) {
                    return false
                }

                if (pair.native && pair.learn) {
                    return pair.native + '-' + pair.learn
                } else {
                    return false;
                }
            },

            setPair: function (data) {
                if (data.native && data.learn) {
                    this.set({pair: {native: data.native, learn: data.learn}});
                }
            },

            hideDeck: function (deckId) {
                this.attrs.hiddenDecks[deckId] = true;
                this.save();
            },

            unhideDeck: function (deckId) {
                delete this.attrs.hiddenDecks[deckId];
                this.save();
            }
        });

        return Preferences;
    }
);