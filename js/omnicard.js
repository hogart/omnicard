var Storage = Chitin.Abstract.extend({
    initialize: function (options) {
        Storage.__super__.initialize.call(this, options);
    },

    save: function (data) {
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
        this.attrs = _.extend({}, this.params.attrs, this.storage.loadDump());
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
        attrs: [],
        storage: Storage
    },

    initialize: function (options) {
        Storable.__super__.initialize.call(this, options);

        this.storage = new this.params.storage({key: this.params.key});
        this.attrs = _.merge([], options.attrs, this.storage.loadDump());
    },

    save: function () {
        var attrs = _.filter(
            this.attrs,
            function (deck) {
                return !deck.builtIn
            }
        );
        this.storage.save(attrs);
    },

    deleteDeck: function (deckIndex) {
        this.attrs[deckIndex] = null;
        this.attrs = _.compact(this.attrs);

        this.save();

        this.trigger('update');
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

var Preferences = Storable.extend({
    defaults: {
        key: 'prefs',
        storage: Storage,
        attrs: {
            showCorrections: true
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

        this.prefs = new this.params.prefs;
        this.pair = this.prefs.getPair();

        this._getLang();
        this.locale = locale[this.lang] || locale.en;

        if (this.pair) {
            this.prepareDecks(PredefinedDecks[this.pair]);
        }

        this.on('languagesChosen', this.onLang, this);

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
        this.prefs.reset();
        this.decks.reset();

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
    }
});

$(function () {
    window.app = new OmniCard({
        deckClass: Decks,
        prefs: Preferences
    });
});