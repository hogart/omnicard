var widgets = {
    Abstract: Chitin.Widget
};

widgets.Nav = widgets.Abstract.extend({
    tpl: 'nav',

    events: {
        'click .js-deckItem': 'onDeckClick',
        'click .js-addDeck': 'onAddDeck',
        'click .js-importExport': 'onImport'
    },

    defaults: {
        pair: 'ru-pl'
    },

    initialize: function (options) {
        widgets.Nav.__super__.initialize.call(this, options);

        this.decks = this.params.decks.attrs;

        this.render({
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

    onImport: function () {
        this.bus.trigger('displayDump');
    }
});

widgets.Test = widgets.Abstract.extend({
    tpl: 'test',

    events: {
        'click .js-answer': 'onAnswer',
        'click .js-skip': 'onSkip'
    },

    _ui: {
        items: '.js-card'
    },

    initialize: function (options) {
        widgets.Test.__super__.initialize.call(this, options);

        this.currentQuestion = 0;
        this.correct = 0;
        this.wrong = 0;

        this.cards = _.chain(this.params.deck).clone().shuffle().value();

        this.render({
            cards: this.cards,
            current: this.currentQuestion
        });
    },

    next: function () {
        this.ui.items.eq(this.currentQuestion).addClass('hidden');

        this.currentQuestion++;

        if (this.currentQuestion == this.params.deck.length) {
            this.final();
        }

        this.ui.items.eq(this.currentQuestion).removeClass('hidden');
    },

    onAnswer: function (evt) {
        var trgt = $(evt.target),
            li = trgt.closest('li'),
            answer = $.trim(li.find('input[type="text"]').val());

        if (answer == this.cards[this.currentQuestion].a) {
            this.correct++;
        } else {
            this.wrong++;
        }

        this.next()
    },

    onSkip: function () {
        this.wrong++;

        this.next();
    },

    final: function () {
        this.$el.trigger('testComplete', {wrong: this.wrong, correct: this.correct});
    }
});

widgets.Score = widgets.Abstract.extend({
    tpl: 'score',

    initialize: function (options) {
        widgets.Score.__super__.initialize.call(this, options);

        this.render({
            wrong: this.params.wrong,
            correct: this.params.correct
        });
    }
});

widgets.Deck = widgets.Abstract.extend({
    tpl: 'deck',

    events: {
        'click .js-start': 'onStart',
        'testComplete .js-test': 'onComplete',
        'click .js-editDeck': 'onEditDeck',
        'click .js-deleteDeck': 'onDeleteDeck'
    },

    _ui: {
        score: '.js-score'
    },

    initialize: function (options) {
        widgets.Deck.__super__.initialize.call(this, options);

        this.render({
            deck: this.params.deck[1] // deck is sent as [id, deckObject]
        });

        this.setState('browsing');
    },

    onStart: function () {
        this.setState('testing');
        this.displayTest({deck: _.shuffle(this.params.deck[1].content)})
    },

    onComplete: function (evt, data) {
        this.setState('scoring');
        this.displayScore(data);
    },

    onEditDeck: function () {
        this.bus.trigger('editDeck', this.params.deck)
    },

    onDeleteDeck: function () {
        this.bus.trigger('deleteDeck', this.params.deck);
    },

    setState: function (state) {
        this.$el.removeClass('deckView__browsing deckView__testing deckView__scoring');
        this.$el.addClass('deckView__' + state);
    },

    displayScore: function (params) {
        this.unregisterChild('.js-score');
        this.registerChild('.js-score', widgets.Score, params);
    },

    displayTest: function (params) {
        this.unregisterChild('.js-test');
        this.registerChild('.js-test', widgets.Test, params);
    }
});

widgets.EditDeck = widgets.Abstract.extend({
    tpl: 'editDeck',

    _ui: {
        frm: 'form',
        cardList: '.js-cardList',
        newQuestion: '.js-addCard .js-question',
        newAnswer: '.js-addCard .js-answer'
    },

    events: {
        'submit form': 'onSubmit',
        'reset form': 'onReset',
        'click .js-confirm': 'addCard',
        'click .js-deleteCard': 'deleteCard'
    },

    initialize: function (options) {
        widgets.EditDeck.__super__.initialize.call(this, options);

        this.deck = this.params.deck;
        this.renderDeck();
    },

    renderDeck: function () {
        var tplData = {
            deck: this.deck[1] || false
        };
        this.render(tplData);
    },

    onSubmit: function (evt) {
        evt.preventDefault();

        var deckRaw = this.ui.frm.form2JSON({
            tags: function (tags) {
                return _.map(tags.split(','), function (tag) {
                    return $.trim(tag)
                })
            }
        });

        deckRaw.content = [];
        _.each(deckRaw.cardq, function (cardQuestion, index) {
            var q = $.trim(cardQuestion),
                a = $.trim(deckRaw.carda[index]);

            if (q && a) {
                deckRaw.content.push({
                    q: q,
                    a: a
                })
            }
        });

        var deck = {};
        deck[this.deck[0]] = _.pick(deckRaw, ['name', 'description', 'tags', 'content']);

        this.bus.decks.set(deck);
    },

    onReset: function (evt) {
        evt.preventDefault();

        this.renderDeck();

        return false;
    },

    addCard: function () {
        var newCard = this.ui.cardList.find('.js-cardForm').last().clone();
        newCard.find('.js-question').val( this.ui.newQuestion.val() );
        newCard.find('.js-answer').val( this.ui.newAnswer.val() );

        newCard.appendTo(this.ui.cardList);

        this.ui.newQuestion.val('');
        this.ui.newAnswer.val('');
    },

    deleteCard: function (evt) {
        var trgt = $(evt.target),
            card = trgt.closest('.js-cardForm');

        card.remove();
    }
});

widgets.Dump = widgets.Abstract.extend({
    tpl: 'dump',

    _ui: {
        form: 'form',
        dump: 'textarea',
        beauty: '.js-beauty'
    },

    events: {
        'submit form': 'saveDeck',
        'click .js-reset': 'onReset',
        'change .js-beauty': '_displayDump',
        'click textarea': 'selectDump'
    },

    initialize: function (options) {
        widgets.Dump.__super__.initialize.call(this, options);

        this.render({});
        this._displayDump();
    },

    _displayDump: function () {
        var str = JSON.stringify(this.bus.decks.attrs, null, this.ui.beauty.prop('checked') ? 2 : 0);

        this.ui.dump.val(str);
    },

    saveDeck: function (evt) {
        evt.preventDefault();

        var raw = this.ui.dump.val(),
            deck;

        try {
            deck = JSON.parse(raw);
        } catch (exception) {
            alert('Invalid format');
        }

        if (deck) {
            this.bus.decks.set(deck);
        }
    },

    onReset: function () {
        this.ui.form[0].reset();
        this._displayDump();
    },

    selectDump: function () {
        this.ui.dump[0].select();
    }
});

widgets.Root = widgets.Abstract.extend({
    tpl: 'root',

    subWidgets: {
        '.js-nav': [widgets.Nav, function () { return {decks: this.bus.decks } }]
    },

    busEvents: {
        'displayDeck': 'displayDeck',
        'editDeck': 'editDeck',
        'addDeck': 'editDeck',
        'deleteDeck': 'deleteDeck',
        'displayDump': 'displayDump'
    },

    initialize: function (options) {
        widgets.Root.__super__.initialize.call(this, options);
        this.render({});

        this.ensureSubWidgets();
    },

    _clearScreen: function () {
        this.unregisterChild('.js-deck');
        this.unregisterChild('.js-edit');
        this.unregisterChild('.js-dump');
    },

    editDeck: function (deck) {
        this._clearScreen();
        this.registerChild('.js-edit', widgets.EditDeck, {deck: deck});
    },

    deleteDeck: function () {
        if (confirm('Really delete this deck?')) {
            this._clearScreen();
        }
    },

    displayDeck: function (deck) {
        this._clearScreen();
        this.registerChild('.js-deck', widgets.Deck, {deck: deck});
    },

    displayDump: function () {
        this._clearScreen();
        this.registerChild('.js-dump', widgets.Dump, {});
    }
});