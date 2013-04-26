define(
    [
        'Storable',
        'Storage',
        '_'
    ],
    function (Storable, Storage, _) {
        /**
         * Storing decks in appropriate way
         * @extends Storable
         * @class Decks
         */
        var Decks = Storable.extend({
            defaults: {
                key: 'decks',
                attrs: [],
                storage: Storage
            },

            initialize: function (options) {
                Storable.__super__.initialize.call(this, options);

                this.storage = new this.params.storage({key: this.params.key, defaultVal: []});

                this.attrs = [];
                this.builtIns = options.attrs;
                this.attrs.push.apply(this.attrs, this.builtIns);

                var dump = this.storage.loadDump();

                this.attrs.push.apply(this.attrs, dump);
            },

            save: function () {
                var attrs = _.filter(
                    this.attrs,
                    function (deck) {
                        return !(!deck || deck.builtIn);
                    }
                );

                this.storage.save(attrs);

                this.attrs = [];
                this.attrs.push.apply(this.attrs, this.builtIns);
                this.attrs.push.apply(this.attrs, attrs);
            },

            deleteDeck: function (deckIndex, options) {
                this.attrs[deckIndex] = null;

                options = options || {silent: false};
                if (!options.silent) {
                    this.save();

                    this.trigger('update');
                }
            }
        }, {
            createDeck: function () {
                return {
                    name: '',
                    description: '',
                    tags: [],
                    content: [],
                    testable: false,

                    isNew: true
                }
            }
        });

        return Decks;
    }
);