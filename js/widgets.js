var widgets = {
    Abstract: Chitin.Widget
};

widgets.Pristine = widgets.Abstract.extend({
    tpl: 'pristine',

    events: {
        'submit form': 'onSubmit'
    },

    initialize: function (options) {
        widgets.Pristine.__super__.initialize.call(this, options);

        this.render({});
    },

    onSubmit: function (evt) {
        evt.preventDefault();

        var data = this.$('form').form2JSON();

        this.bus.trigger('languagesChosen', data);
    }
});

widgets.Nav = widgets.Abstract.extend({
    tpl: 'nav',

    events: {
        'click .js-deckItem': 'onDeckClick',
        'click .js-addDeck': 'onAddDeck',
        'click .js-importExport': 'onImport'
    },

    initialize: function (options) {
        widgets.Nav.__super__.initialize.call(this, options);

        this.listenTo(this.bus.decks, 'update', this.rr);

        this.rr();
    },

    rr: function () {
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

widgets.Start = widgets.Abstract.extend({
    tpl: 'start',

    _ui: {
        toggled: '.js-content, .js-hide, .js-show'
    },

    events: {
        'click button': 'triggerVerbosity'
    },

    initialize: function (options) {
        widgets.Start.__super__.initialize.call(this, options);

        this.verbosity = this.bus.prefs.get('showHelp', true);

        this.render({
            verbosity: this.verbosity
        });
    },

    triggerVerbosity: function () {
        this.verbosity = !this.verbosity;

        this.ui.toggled.toggleClass('hidden');

        this.bus.prefs.set({showHelp: this.verbosity});
    }
});

widgets.ExploreAbstract = widgets.Abstract.extend({
    _ui: {
        items: '.js-card'
    },

    initialize: function (options) {
        widgets.ExploreAbstract.__super__.initialize.call(this, options);

        this.currentQuestion = 0;

        this.cards = _.chain(this.params.deck.content).clone().shuffle().value();
        this.name = this.params.deck.name;

        this.rr();
    },

    rr: function () {
        this.render({
            name: this.name,
            cards: this.cards,
            current: this.currentQuestion
        });
    },

    next: function () {
        this.ui.items.eq(this.currentQuestion).addClass('hidden');

        this.currentQuestion++;

        if (this.currentQuestion == this.cards.length) {
            this.final();
        }

        this.ui.items.eq(this.currentQuestion).removeClass('hidden');
    }
});

widgets.TestAbstract = widgets.ExploreAbstract.extend({
    events: {
        'click .js-answer': 'onAnswer',
        'click .js-skip': 'onSkip',
        'click .js-next': 'next'
    },

    initialize: function (options) {
        this.correct = 0;
        this.wrong = 0;
this.showCorrections = true;
        widgets.TestAbstract.__super__.initialize.call(this, options);
    },

    onAnswer: function (evt) {
        var trgt = $(evt.target),
            li = trgt.closest('li'),
            answer = this.retrieveAnswer(li),
            correctAnswer = this.cards[this.currentQuestion].a;

        if (answer == correctAnswer) {
            this.correct++;
            this.next();
        } else {
            this.wrong++;

            if (this.showCorrections) {
                li.find('.js-correction').html(correctAnswer).removeClass('hidden');
                li.find('.js-next').removeClass('hidden');
            } else {
                this.next();
            }
        }
    },

    onSkip: function () {
        this.wrong++;

        this.next();
    },

    final: function () {
        this.$el.trigger('testComplete', {wrong: this.wrong, correct: this.correct});
    }
});

widgets.Exam = widgets.TestAbstract.extend({
    tpl: 'testExam',

    retrieveAnswer: function (container) {
        return $.trim(container.find('input[type="text"]').val());
    }
});

widgets.Test = widgets.TestAbstract.extend({
    tpl: 'testTest',

   /**
    * Returns `amount` random unique entries from `arr`, excluding `excludeIndex`
    * @param {Array} arr
    * @param {Number} amount
    * @param {Number} excludeIndex
    * @return {Array}
    * @private
    */
    _randEntries: function(arr, amount, excludeIndex) {
        var result = [],
            randoms = [],
            maxRand = arr.length - 1,
            rand;

        for (var i = 0; i < amount; i++) {
            do {
                rand = _.random(0, maxRand);
            } while (_.contains(randoms, rand) || rand == excludeIndex);

            result.push(arr[rand])
        }

        return result;
    },

    rr: function () {
        var randEntries = this._randEntries,
            cards = this.cards,
            tests = _.map(cards, function (card, index ) {
                var test = {
                        q: card.q
                    },
                    answers = _.pluck(randEntries(cards, 3, index), 'a');

                answers.push(card.a);

                test.a = _.shuffle(answers);

                return test;
            });

        this.render({
            name: this.name,
            cards: tests,
            currentQuestion: this.currentQuestion
        })
    },

    retrieveAnswer: function (container) {
        return container.find('input:checked').val();
    }
});

widgets.Meditation = widgets.ExploreAbstract.extend({
    tpl: 'testMeditation',

    events: {
        'click .js-next': 'next'
    },

    final: function () {
        this.$el.trigger('meditationOver');
    }
});

widgets.Score = widgets.Abstract.extend({
    tpl: 'score',

    initialize: function (options) {
        widgets.Score.__super__.initialize.call(this, options);

        this.render({
            congrats: this.params.congrats,
            wrong: this.params.wrong,
            correct: this.params.correct,
            testable: this.params.testable
        });
    }
});

widgets.Deck = widgets.Abstract.extend({
    tpl: 'deck',

    events: {
        'click .js-startMeditation': 'onStartMeditation',
        'click .js-startTest': 'onStartTest',
        'click .js-startExam': 'onStartExam',

        'meditationOver .js-test': 'onMeditationComplete',
        'testComplete .js-test': 'onTestComplete',

        'click .js-editDeck': 'onEditDeck',
        'click .js-deleteDeck': 'onDeleteDeck'
    },

    _ui: {
        score: '.js-score'
    },

    initialize: function (options) {
        widgets.Deck.__super__.initialize.call(this, options);

        this.deck = this.params.deck[1]; // deck is sent as [id, deckObject]
        this.testable = this.deck.testable && this.deck.content.length > 3;

        this.render({
            deck: this.deck,
            testable: this.testable
        });

        this.setState('browsing');
    },

    onStartMeditation: function () {
        this.displayExercise(widgets.Meditation);
    },

    onStartTest: function () {
        this.displayExercise(widgets.Test);
    },

    onStartExam: function () {
        this.displayExercise(widgets.Exam);
    },

    onMeditationComplete: function (evt) {
        this.setState('scoring');
        this.displayScore({congrats: true, testable: this.testable});
    },

    onTestComplete: function (evt, data) {
        this.setState('scoring');
        data.testable = this.testable;
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

    displayExercise: function (type) {
        this.setState('testing');
        this.unregisterChild('.js-test');
        this.registerChild('.js-test', type, {deck: this.deck});
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
            deck: this.deck ? this.deck[1] : false
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

        deckRaw.testable = !!deckRaw.testable;

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

        var deckContent = _.pick(deckRaw, ['name', 'description', 'tags', 'content']);
        if (this.deck) {
            var deck = {};
            deck[this.deck[0]] = deckContent;

            this.bus.decks.set(deck);
        } else {
            this.bus.decks.attrs.push(deckContent);
            this.bus.decks.set({}); // trick to force save and trigger `update` event
        }

        this.bus.trigger('displayStart');
    },

    onReset: function (evt) {
        evt.preventDefault();

        this.renderDeck();

        return false;
    },

    addCard: function () {
        var newCard = this.$('.js-cardTemplate').clone();
        newCard.find('.js-question').val( this.ui.newQuestion.val() );
        newCard.find('.js-answer').val( this.ui.newAnswer.val() );

        newCard.appendTo(this.ui.cardList).removeClass('hidden');

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
            this.bus.trigger('displayStart');
        }
    },

    onReset: function () {
        this.bus.trigger('displayStart');
    },

    selectDump: function () {
        this.ui.dump[0].select();
    }
});

widgets.Root = widgets.Abstract.extend({
    tpl: 'root',

    startWidgets: {
        '.js-pristine': widgets.Pristine
    },

    workWidgets: {
        '.js-nav': [widgets.Nav, function () { return {decks: this.bus.decks } }],
        '.js-start': widgets.Start
    },

    busEvents: {
        'startWork': 'startWork',

        'displayStart': 'displayStart',
        'displayDeck': 'displayDeck',
        'editDeck': 'editDeck',
        'addDeck': 'editDeck',
        'deleteDeck': 'deleteDeck',
        'displayDump': 'displayDump'
    },

    initialize: function (options) {
        widgets.Root.__super__.initialize.call(this, options);
        this.render({});

        if (this.bus.pair) {
            this.startWork();
        } else {
            this.ensureSubWidgets(this.startWidgets);
            this.$el
                .removeClass('root__work')
                .addClass('root__pristine');
        }
    },

    startWork: function () {
        this.ensureSubWidgets(this.workWidgets);
        this.$el
            .removeClass('root__pristine')
            .addClass('root__work');
    },

    _clearScreen: function () {
        this.unregisterChild('.js-pristine');
        this.unregisterChild('.js-start');
        this.unregisterChild('.js-deck');
        this.unregisterChild('.js-edit');
        this.unregisterChild('.js-dump');
    },

    displayStart: function () {
        this._clearScreen();
        this.registerChild('.js-start', widgets.Start, {});
    },

    editDeck: function (deck) {
        this._clearScreen();
        this.registerChild('.js-edit', widgets.EditDeck, {deck: deck});
    },

    deleteDeck: function (deck) {
        if (confirm('Really delete this deck?')) {
            this.bus.decks.deleteDeck(deck[0]);
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