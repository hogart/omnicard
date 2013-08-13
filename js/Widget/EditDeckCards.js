define(
    [
        'Widget/Abstract',
        'Widget/EditCard'
    ],

    function (WidgetAbstract, WidgetEditCard) {
        'use strict';

        /**
         *
         * @class
         * @extends WidgetAbstract
         */
        var WidgetEditDeckCards = WidgetAbstract.extend(/** @lends WidgetEditDeckCards.prototype*/ {
            tpl: 'editDeckCards',

            _ui: function () {
                var ui = {};

                if (!this.deck.builtIn) {
                    ui['tbody'] = 'tbody';
                }

                return ui;
            },

            events: function () {
                var events = {};

                if (!this.deck.builtIn) {
                    events['click tbody tr'] = 'onRowClick';
                    events['click tfoot .js-add'] = 'onAddClick';
                }

                return events;
            },

            formSelector: '.js-formRow td',

            /**
             * @constructor
             * @param {Object} options
             * @param {Object} options.deck
             */
            initialize: function (options) {
                this.deck = options.deck;

                WidgetEditDeckCards.__super__.initialize.call(this, options);

                this.rr();

                this.formRowStub = $('<tr class="js-formRow"><td colspan="4"></td></tr>');

                this.on('submit', this.onEditCard, this);
                this.on('cancel', this.onEditCardCancel, this);
                this.on('delete', this.onEditCardDelete, this);
            },

            rr: function () {
                this.render({deck: this.deck});

                this._ensureUI();
            },

            onRowClick: function (evt) {
                var row = $(evt.target).closest('tr'),
                    index = row.attr('data-id');

                if (_.isUndefined(index)) {
                    return;
                }

                var formRow = this.formRowStub.clone();

                row.after(formRow);

                row.addClass('hidden');

                // TODO: fix registerChild in Chitin.js so it would accept elements too
                // TODO: fix registerChild in Chitin.js so it would return created child
                this.registerChild(
                    this.formSelector + this.index,
                    WidgetEditCard,
                    {
                        el: formRow.find('td'),
                        deck: this.deck,
                        card: this.deck.content[index],
                        index: index,
                        parent: this
                    }
                );
            },

            onEditCardCancel: function (form) {
                var formRow = form.$el.parent('tr'),
                    cardRow = formRow.prev(),
                    index = Number(cardRow.attr('data-id'));

                this.unregisterChild(this.formSelector + index);

                cardRow.removeClass('hidden');
                formRow.remove();
            },

            onEditCard: function (card, index) {
                if (index !== null) {
                    this.deck.content[index] = card
                } else {
                    this.deck.content.push(card);
                }

                this.rr();
            },

            onEditCardDelete: function (index) {
                this.deck.content.splice(index, 1);

                this.rr();
            },

            onAddClick: function (evt) {
                var formRow = this.formRowStub.clone();
                formRow.appendTo(this.ui.tbody);

                this.registerChild(
                    this.formSelector + 'new',
                    WidgetEditCard,
                    {
                        el: formRow.find('td'),
                        deck: this.deck,
                        parent: this
                    }
                );
            }
        });

        return WidgetEditDeckCards;
    }
);