define(
    [
        'Widget/Abstract'
    ],

    function (WidgetAbstract) {
        'use strict';

        /**
         *
         * @class
         * @extends WidgetAbstract
         */
        var WidgetEditCard = WidgetAbstract.extend(/** @lends WidgetEditCard.prototype*/ {
            tpl: 'editCard',

            events: {
                'click .js-toggleAdd': 'onToggleAdd',
                'click .js-confirm': 'onConfirm',
                'click .js-cancel': 'onReset',
                'click .js-delete': 'onDelete'
            },

            /**
             * @constructor
             * @param {Object} options
             * @param {Object} options.deck
             * @param {Object} options.card
             */
            initialize: function (options) {
                WidgetEditCard.__super__.initialize.call(this, options);

                this.deck = this.params.deck;

                this.parent = this.params.parent;

                if ('index' in this.params) {
                    this.index = Number(this.params.index)
                } else {
                    this.index = null;
                }

                // temp storage for when toggling visibility
                this.stored = {
                    cardq: '',
                    carda: '',
                    cardeg: '',
                    cardipa: ''
                };

                this.rr();
            },

            rr: function () {
                var data = {
                    disabled: this.params.deck.builtIn ? 'disabled="disabled"' : '',
                    card: this.params.card || {},
                    isAdd: !!this.params.isAdd
                };

                this.render(data);
            },

            show: function () {
                this.$el.removeClass('hidden');

                _.each(this.stored, function (val, key) {
                    this.$('input[name="' + key + '"]').val(val);
                }, this)
            },

            hide: function () {
                this.stored = this.$el.form2JSON();

                this.$('input').val('');
                this.$el.addClass('hidden');
            },

            onToggleAdd: function (evt) {
                var btn = $(evt.target).closest('.btn'),
                    row = btn.closest('.row-fluid'),
                    input = row.find('input');

                if (row.hasClass('present')) {
                    this.stored[input[0].name] = input.val(); // store temporarily
                    input.val('');
                } else {
                    row.find('input').focus().val(this.stored[input[0].name]); // restore when show again
                }

                row.toggleClass('absent present');
                btn.toggleClass('btn-danger');
            },

            onConfirm: function (evt) {
                var card = {};

                _.each(this.stored, function (value, key) {
                    var val = this.$('input[name="' + key + '"]').val().trim();

                    if (val) {
                        card[key.substr(4)] = val;
                    }
                }, this);

                if (card.q && card.a) {
                    this.parent.trigger('submit', card, this.index);
                } else {
                    alert(this.bus.locale.invalidCard);
                }
            },

            onReset: function (evt) {
                this.parent.trigger('cancel', this);
            },

            onDelete: function (evt) {
                this.parent.trigger('delete', this.index);
            }
        });


        return WidgetEditCard;
    }
);