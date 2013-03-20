var Storage = Chitin.Abstract.extend({
    initialize: function (options) {
        Storage.__super__.initialize.call(this, options);
    },

    save: function (data) {console.log(data);
        localStorage.setItem(this.params.key, JSON.stringify(data));
    },

    loadDump: function() {
        var loaded = localStorage.getItem(this.params.key),
            result = {};

        if (loaded) {
            try {
                result = JSON.parse(loaded)
            }
            catch(e) {}
        }

        return result;
    }
});

var Storable = Chitin.Observable.extend({
    initialize: function (options) {
        Storable.__super__.initialize.call(this, options);

        this.storage = new this.params.storage({key: this.params.key});
        this.attrs = _.extend(this.params.attrs, this.storage.loadDump());
    },

    get: function (key, defaultVal) {
        return key in this.attrs ? this.attrs[key] : defaultVal;
    },

    set: function (attrs, options) {
        _.extend(this.attrs, attrs);
        this.save();

        if (options && !options.silent) {
            this.trigger('update');
        }

        return this;
    },

    reset: function (options) {
        this.attrs = {};
        this.save();

        if (options && !options.silent) {
            this.trigger('update');
        }

        return this;
    },

    save: function () {
        this.storage.save(this.attrs);
    }
});

var Decks = Storable.extend({
    defaults: {
        key: 'decks',
        attrs: PredefinedDecks,
        storage: Storage
    },

    deleteDeck: function (deckIndex) {
        this.attrs[deckIndex] = null;
        this.attrs = _.compact(this.attrs);

        this.save();

        this.trigger('update');
    }
});

var Preferences = Storable.extend({
    defaults: {
        key: 'prefs',
        storage: Storage,
        attrs: {}
    }
});

var OmniCard = Chitin.Application.extend({
    defaults: {
        immediateStart: false,
        rootNode: '.js-root',
        rootWidget: widgets.Root
    },

    initialize: function (options) {
        OmniCard.__super__.initialize.call(this, options);

        var pair = 'ru-pl',
            key = 'deck' + '.' + pair,
            predef = PredefinedDecks[pair];

        this.decks = new this.params.deckClass({
            key: key,
            attrs: predef
        });

        this.prefs = new this.params.prefs;

        this.start();
    }
});

$(function () {
    window.app = new OmniCard({
        deckClass: Decks,
        prefs: Preferences
    });
});