var widgets = {
    Abstract: SimpleWidget
};

widgets.Nav = widgets.Abstract.extend({
    tpl: 'nav',

    events: {
        'click li.js-deckItem': 'onDeckClick'
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
        frm: 'form'
    },

    events: {
        'submit form': 'onSubmit',
        'reset form': 'onReset'
    },

    initialize: function (node, options) {
        widgets.EditDeck.__super__.initialize.call(this, node, options);

        this.deck = this.params.deck;

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
    }
});

widgets.Root = widgets.Abstract.extend({
    tpl: 'root',

    subWidgets: {
        '.js-nav': widgets.Nav
    },

    busEvents: {
        'displayDeck': 'displayDeck',
        'editDeck': 'editDeck'
    },

    initialize: function (node) {
        widgets.Root.__super__.initialize.call(this, node);
        this.render({});

        this.ensureSubWidgets();
    },

    editDeck: function (evt, deck) {
        this.unregisterChild('.js-deck');
        this.unregisterChild('.js-edit');
        this.registerChild('.js-edit', widgets.EditDeck, {deck: deck});
    },

    displayDeck: function (evt, deck) {
        this.unregisterChild('.js-edit');
        this.unregisterChild('.js-deck');
        this.registerChild('.js-deck', widgets.Deck, {deck: deck});
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