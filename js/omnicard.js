var widgets = {
    Abstract: SimpleWidget
};

widgets.Nav = widgets.Abstract.extend({
    tpl: 'nav',

    events: {
        'click .js-deckItem': 'onDeckClick',
        'click .js-importExport': 'onImport'
    },

    defaults: {
        pair: 'ru-pl'
    },

    initialize: function (node) {
        widgets.Nav.__super__.initialize.call(this, node);

        this.decks = Decks[this.params.pair];

        this.render({
            decks: this.decks
        });
    },

    onDeckClick: function (evt) {
        var target = $(evt.target ),
            index = target.index() - 1;

        this.bus.trigger('displayDeck', this.decks[index]);
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

    initialize: function (node, options) {
        widgets.Test.__super__.initialize.call(this, node, options);

        this.currentQuestion = 0;
        this.correct = 0;
        this.wrong = 0;

        this.deck = _.clone(this.params.deck);

        this.render({
            deck: _.shuffle(this.deck),
            current: this.currentQuestion
        })
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
        var trgt = $(evt.target ),
            li = trgt.closest('li'),
            answer = $.trim(li.find('input[type="text"]').val());

        if (answer == this.params.deck[this.currentQuestion].a) {
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

    initialize: function (node, options) {
        widgets.Score.__super__.initialize.call(this, node, options);

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
        'click .js-editDeck': 'onEditDeck'
    },

    _ui: {
        score: '.js-score'
    },

    initialize: function (node, options) {
        widgets.Deck.__super__.initialize.call(this, node, options);

        this.render({
            deck: this.params.deck
        });

        this.setState('browsing');
    },

    onStart: function () {
        this.setState('testing');
        this.displayTest({deck: _.shuffle(this.params.deck.content)})
    },

    onComplete: function (evt, data) {
        this.setState('scoring');
        this.displayScore(data);
    },

    onEditDeck: function () {
        this.bus.trigger('editDeck', this.params.deck)
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

    initialize: function (node, options) {
        widgets.EditDeck.__super__.initialize.call(this, node, options);

        this.deck = this.params.deck;
        this.renderDeck();
    },

    renderDeck: function () {
        this.render({
            deck: this.deck || false
        })
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

        _.extend(
            this.deck,
            _.pick(deckRaw, ['name', 'description', 'tags'])
        );

        this.deck.content = deckRaw.content;

        //this.deck.save();
    },

    onReset: function (evt) {
        evt.preventDefault();

        this.renderDeck();

        return false;
    },

    addCard: function () {
        var newCard = this.ui.cardList.find('.js-cardForm').clone();
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

    initialize: function (node, options) {
        widgets.Dump.__super__.initialize.call(this, node, options);

        this.render({});
        this._displayDump();
    },

    _displayDump: function () {
        var str = JSON.stringify(Decks, null, this.ui.beauty.prop('checked') ? 2 : 0);

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
            Decks = deck;
        }
        console.log(Decks)
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
        '.js-nav': widgets.Nav
    },

    busEvents: {
        'displayDeck': 'displayDeck',
        'editDeck': 'editDeck',
        'displayDump': 'displayDump'
    },

    initialize: function (node, options) {
        widgets.Root.__super__.initialize.call(this, node, options);
        this.render({});

        this.ensureSubWidgets();
    },

    _clearScreen: function () {
        this.unregisterChild('.js-deck');
        this.unregisterChild('.js-edit');
        this.unregisterChild('.js-dump');
    },

    editDeck: function (evt, deck) {
        this._clearScreen();
        this.registerChild('.js-edit', widgets.EditDeck, {deck: deck});
    },

    displayDeck: function (evt, deck) {
        this._clearScreen();
        this.registerChild('.js-deck', widgets.Deck, {deck: deck});
    },

    displayDump: function () {
        this._clearScreen();
        this.registerChild('.js-dump', widgets.Dump, {});
    }
});


function initWidget(node, parent) {
    var widgetName = parent ? parent.find(node) : node.attr('data-widget' ),
        widget = widgets[widgetName];

    return new widget(node);
}

$(function () {
    initWidget($('.js-root'));
});