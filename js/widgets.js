var widgets = {
    Abstract: Chitin.Widget.extend({
        render: function (data) {
            data = _.extend(data, {locale: this.bus.locale});

            widgets.Abstract.__super__.render.call(this, data);
        }
    })
};

widgets.LangSelect = widgets.Abstract.extend({
    tpl: 'langSelect',

    initialize: function (options) {
        widgets.LangSelect.__super__.initialize.call(this, options);

        this.render({
            lang: this.bus.lang,
            langs: {
                en: 'English',
                ru: 'Русский'
            }
        });
    }
});

widgets.Pristine = widgets.Abstract.extend({
    tpl: 'pristine',

    events: {
        'submit form': 'onSubmit'
    },

    subWidgets: {
        '.js-changeLang': widgets.LangSelect
    },

    initialize: function (options) {
        widgets.Pristine.__super__.initialize.call(this, options);

        this.render({});
        this.ensureSubWidgets();
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
        'click .js-settingsItem': 'onSettings',
        'click .js-decksItem': 'onDeckList'
    },

    initialize: function (options) {
        widgets.Nav.__super__.initialize.call(this, options);

        this.listenTo(this.bus.decks, 'update', this.rr);

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
        var target = $(evt.target ),
            index = target.index() - 1,
            deck = [index, this.decks[index]];

        this.bus.trigger('displayDeck', deck);
    },

    onAddDeck: function () {
        this.bus.trigger('addDeck');
    },

    onSettings: function () {
        this.bus.trigger('displaySettings');
    },

    onDeckList: function () {
        this.bus.trigger('displayDecks');
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
        items: '.js-card',
        progress: '.js-progress'
    },

    initialize: function (options) {
        widgets.ExploreAbstract.__super__.initialize.call(this, options);

        this.currentQuestion = 0;

        this.cards = _.shuffle(_.cloneDeep(this.params.deck.content));
        this.name = this.params.deck.name;

        this.rr();
    },

    rr: function () {
        this.render({
            name: this.name,
            cards: this.cards,
            current: this.currentQuestion
        });
        this._renderProgress();
    },

    /**
     * @protected
     */
    _renderProgress: function () {
        var width = 1;

        width += Math.ceil(this.currentQuestion / this.cards.length * 99);

        this.ui.progress.css({
            width: width + '%'
        });

        this.ui.progress.text(this.currentQuestion + '/' + this.cards.length)
    },

    next: function () {
        this.ui.items.eq(this.currentQuestion).addClass('hidden');

        this.currentQuestion++;

        this._renderProgress();

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

        widgets.TestAbstract.__super__.initialize.call(this, options);

        this.showCorrections = this.bus.prefs.get('showCorrections');
        this.corrections = [];
    },

    isCorrect: function (answer, correctAnswer) {
        if (this.caseSensitive) {
            return answer == correctAnswer
        } else {
            return answer.toLowerCase() == correctAnswer.toLowerCase()
        }
    },

    onAnswer: function (evt) {
        var trgt = $(evt.target),
            li = trgt.closest('li'),
            answer = this.retrieveAnswer(li),
            correctAnswer = this.cards[this.currentQuestion].a;

        if (this.isCorrect(answer, correctAnswer)) {
            this.correct++;
            this.next();
        } else {
            this.wrong++;

            if (this.showCorrections) {
                li.find('.js-correction').html(correctAnswer).removeClass('hidden');
                li.find('.js-next').removeClass('hidden');
                li.find('.js-answerBlock').addClass('hidden');
                this.corrections.push({
                    q: this.cards[this.currentQuestion].q,
                    a: this.cards[this.currentQuestion].a,
                    w: answer
                });
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
        var params = {
            wrong: this.wrong,
            correct: this.correct
        };

        if (this.corrections.length) {
            params.corrections = this.corrections
        }

        this.$el.trigger('testComplete', params);
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
            testable: this.params.testable,
            corrections: this.params.corrections
        });
    }
});

widgets.DeckList = widgets.Abstract.extend({
    tpl: 'deckList',

    events: {
        'change .js-selectAll': 'selectAll',
        'change tbody input[type="checkbox"]': 'selectAny',
        'click .js-hide': 'onHide',
        'click .js-show': 'onShow',
        'click .js-export': 'onExport',
        'click .js-done': function () { this.ui.table.removeClass('deckList-full'); },
        'click textarea': function () { this.ui.dump[0].select(); },

        'click .js-editDeck': 'onEditDeck',
        'click .js-hideDeck': 'onHideDeck',
        'click .js-unhideDeck': 'onShowDeck'
    },

    _ui: {
        table: 'table',
        selectAll: '.js-selectAll',
        boxes: 'tbody input[type="checkbox"]',
        buttons: 'thead button',
        dump: 'textarea'
    },

    initialize: function (options) {
        widgets.DeckList.__super__.initialize.call(this, options);

        this.rr();

        this.listenTo(this.bus.decks, 'update', this.rr);
    },

    rr: function () {
        this.render({
            decks: this.bus.decks.attrs,
            hiddenDecks: this.bus.prefs.attrs.hiddenDecks
        });
    },

    selectAll: function () {
        var checked = this.ui.selectAll.prop('checked');

        this.ui.boxes.prop('checked', checked);

        this._enableButtons(checked);
    },

    selectAny: function () {
        this._enableButtons(this._getChecked().length)
    },

    onHide: function () {
        var checked = this._getChecked(),
            bus = this.bus,
            hideDeck = _.bind(this._hideDeck, this);

        checked.each(function (index, node) {
            var deck = bus.decks.attrs[index];

            hideDeck(deck, index);
        });

        bus.decks.save();
        bus.decks.trigger('update');
    },

    onShow: function () {
        var checked = this._getChecked(),
            bus = this.bus;

        checked.each(function (index, node) {
            var deck = bus.decks.attrs[index];
            if (deck.builtIn) {
                bus.unhideDeck(deck.id);
            }
        });

        bus.decks.trigger('update');
    },

    onExport: function () {
        var checked = this._getChecked(),
            bus = this.bus,
            exportArr = [],
            exported = {};

        checked.each(function (index, node) {
            exportArr.push(
                _.omit(bus.decks.attrs[index], ['builtIn', 'id'])
            );
        });

        exported[this.bus.pair] = exportArr;

        this.ui.table.addClass('deckList-full');
        this.ui.dump.val(JSON.stringify(exported));
    },

    onEditDeck: function (evt) {
        var tr = $(evt.target).closest('tr'),
            id = parseInt(tr.attr('data-id')),
            deck = this.bus.decks.attrs[id];

        this.bus.trigger('editDeck', [id, deck]);
    },

    onHideDeck: function (evt) {
        var tr = $(evt.target).closest('tr'),
            id = parseInt(tr.attr('data-id')),
            deck = this.bus.decks.attrs[id];

        this._hideDeck(deck, id);

        this.bus.decks.save();
        this.bus.decks.trigger('update');
    },

    onShowDeck: function (evt) {
        var tr = $(evt.target).closest('tr'),
            id = parseInt(tr.attr('data-id')),
            deck = this.bus.decks.attrs[id];

        this.bus.unhideDeck(deck.id);

        this.bus.decks.save();
        this.bus.decks.trigger('update');
    },

    _hideDeck: function (deck, index) {
        if (deck.builtIn) {
            this.bus.hideDeck(deck.id);
        } else {
            this.bus.decks.deleteDeck(index, {silent: true});
        }
    },

    _enableButtons: function (enable) {
        if (enable) {
            this.ui.buttons.prop('disabled', false);
        } else {
            this.ui.buttons.prop('disabled', true);
        }
    },

    _getChecked: function () {
        return this.ui.boxes.filter(':checked');
    }
});

widgets.Deck = widgets.Abstract.extend({
    tpl: 'deck',

    events: {
        'click .js-startMeditation': 'onStartMeditation',
        'click .js-startTest': 'onStartTest',
        'click .js-startExam': 'onStartExam',

        'change [name="showCorrections"]': 'onShowCorrectionsChange',

        'meditationOver .js-test': 'onMeditationComplete',
        'testComplete .js-test': 'onTestComplete',

        'click .js-editDeck': 'onEditDeck',
        'click .js-deleteDeck': 'onDeleteDeck',
        'click .js-hideDeck': 'onHideDeck'
    },

    _ui: {
        score: '.js-score',
        showCorrections: '[name="showCorrections"]'
    },

    initialize: function (options) {
        widgets.Deck.__super__.initialize.call(this, options);

        this.deck = this.params.deck[1]; // deck is sent as [id, deckObject]
        this.testable = this.deck.testable && this.deck.content.length > 3;

        this.render({
            deck: this.deck,
            testable: this.testable,
            showCorrections: this.bus.prefs.get('showCorrections')
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

    onHideDeck: function () {
        this.bus.trigger('hideDeck', this.params.deck);
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
        this.registerChild(
            '.js-test',
            type,
            {
                deck: this.deck
            }
        );
    },

    onShowCorrectionsChange: function (evt) {
        this.bus.prefs.set({showCorrections: this.ui.showCorrections.is(':checked')})
    }
});

widgets.EditDeck = widgets.Abstract.extend({
    tpl: 'editDeck',

    _ui: {
        frm: 'form',
        cardList: '.js-cardList',
        newQuestion: '.js-addCard .js-question',
        newAnswer: '.js-addCard .js-answer',

        dumpDeck: '.js-dumpDeck',
        dumpDeckDumpster: '.js-dumpDeck .js-dumpster',
        dumpDeckTA: '.js-dumpDeck textarea',
        dumpDeckDone: '.js-dumpDeck .js-done',

        dumpCards: '.js-dumpCards',
        dumpCardsDumpster: '.js-dumpCards .js-dumpster',
        dumpCardsTA: '.js-dumpCards textarea',
        dumpCardsDone: '.js-dumpCards .js-done'
    },

    events: {
        'submit form': 'onSubmit',
        'reset form': 'onReset',
        'click .js-confirm': 'addCard',
        'click .js-deleteCard': 'deleteCard',

        'click .js-dump .js-import, .js-dump .js-export': 'toggleDumpster',
        'click .js-dump .js-done': 'doneDumpster'
    },

    initialize: function (options) {
        widgets.EditDeck.__super__.initialize.call(this, options);

        this.deck = this.params.deck ? this.params.deck[1] : this.bus.createDeck();
        this.id = this.params.deck ? this.params.deck[0] : null;

        this.renderDeck();
    },

    renderDeck: function () {
        var tplData = {
            deck: this.deck
        };

        tplData.cardsDump = _.map(this.deck.content, function (card) {
            return card.q + '\t' + card.a
        }).join('\n');

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
        if (_.isNull(this.id)) {
            this.bus.decks.attrs.push(deckContent);
            this.bus.decks.set({}); // trick to force save
        } else {
            var deck = {};
            deck[this.deck[0]] = deckContent;

            this.bus.decks.set(deck);
        }

        this.bus.decks.trigger('update');

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

        newCard.appendTo(this.ui.cardList).removeClass('hidden js-cardTemplate');

        this.ui.newQuestion.val('');
        this.ui.newAnswer.val('');
    },

    deleteCard: function (evt) {
        var trgt = $(evt.target),
            card = trgt.closest('.js-cardForm');

        card.remove();
    },

    toggleDumpster: function (evt) {
        var trgt = $(evt.target),
            dumpster = trgt.closest('.js-dump').find('.js-dumpster');

        trgt.toggleClass('active');
        dumpster.toggleClass('hidden');
    },

    doneDumpster: function (evt) {
        var trgt = $(evt.target),
            container = trgt.closest('.js-dump'),
            ta = container.find('textarea'),
            isDeck = container.hasClass('js-dumpDeck');

        var content = $.trim(ta.val());

        if (!content) {
            this.toggleDumpster(evt);
            return;
        } else {
            if (isDeck) {
                var deckData;
                try {
                    deckData = JSON.parse(content);
                } catch (e) {
                    alert(this.bus.locale.invalidFormat);
                    return
                }

                this.deck = _.extend(this.deck, deckData);
            } else {
                var cards = _.map(content.split('\n'), function (line) {
                    var parts = line.split(/\t|    /mg);
                    return {
                        q: parts[0],
                        a: parts[1]
                    }
                });

                this.deck.content = _.extend(this.deck.content, cards);
            }

            this.renderDeck();

            return;
        }
    }
});

widgets.Settings = widgets.Abstract.extend({
    tpl: 'settings',

    events: {
        'click .js-dump': function () { this.bus.trigger('displayDump') },
        'click .js-reset': 'onResetClick',
        'click .js-changeLang': 'onChangeLang'
    },

    subWidgets: {
        '.js-langSelect': widgets.LangSelect
    },

    initialize: function (options) {
        widgets.Settings.__super__.initialize.call(this, options);

        this.render({});
        this.ensureSubWidgets();
    },

    onResetClick: function () {
        if (confirm(this.bus.locale.confirmClearAll)) {
            this.bus.reset();
        }
    },

    onChangeLang: function () {
        var lang = this.$('[name="interface"]').val();
        this.bus.prefs.set({interface: lang});
        window.location.reload();
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
            alert(this.bus.locale.invalidFormat);
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
        'hideDeck': 'hideDeck',
        'displayDump': 'displayDump',
        'displaySettings': 'displaySettings',
        'displayDecks': 'displayDecks'
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
        this.unregisterChild('.js-deckList');
        this.unregisterChild('.js-edit');
        this.unregisterChild('.js-settings');
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
        if (confirm(this.bus.locale.deleteDeckConfirm)) {
            this.bus.decks.deleteDeck(deck[0]);
            this._clearScreen();
        }
    },

    hideDeck: function (deck) {
        if (confirm(this.bus.locale.hideDeckConfirm)) {
            this.bus.hideDeck(deck[1].id);
            this._clearScreen();
        }
    },

    displayDecks: function () {
        this._clearScreen();
        this.registerChild('.js-deckList', widgets.DeckList, {});
    },

    displayDeck: function (deck) {
        this._clearScreen();
        this.registerChild('.js-deck', widgets.Deck, {deck: deck});
    },

    displaySettings: function () {
        this._clearScreen();
        this.registerChild('.js-settings', widgets.Settings, {});
    },

    displayDump: function () {
        this._clearScreen();
        this.registerChild('.js-dump', widgets.Dump, {});
    }
});