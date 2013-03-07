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

widgets.Deck = widgets.Abstract.extend({
    tpl: 'deck',

    initialize: function (node, options) {
        widgets.Deck.__super__.initialize.call(this, node, options);

        this.render({
            deck: this.params.deck
        })
    }
});

widgets.Root = widgets.Abstract.extend({
    tpl: 'root',

    subWidgets: {
        '.js-nav': widgets.Nav
    },

    busEvents: {
        'displayDeck': 'displayDeck'
    },

    initialize: function (node) {
        widgets.Root.__super__.initialize.call(this, node);
        this.render({});

        this.ensureSubWidgets();
    },

    displayDeck: function (evt, deck) {
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