define(
    [
        'Widget/Abstract',
        '_'
    ],
    function (WidgetAbstract, _) {
        'use strict';

        var WidgetDeckList = WidgetAbstract.extend({
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
                WidgetDeckList.__super__.initialize.call(this, options);

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

        return WidgetDeckList;
    }
);