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

            /**
             * @constructor
             * @param {Object} options
             * @param {Object} options.deck
             * @param {Object} options.card
             */
            initialize: function (options) {
                WidgetEditCard.__super__.initialize.call(this, options);
            },

            rr: function () {
                var data = {
                    disabled: this.params.deck.builtIn ? 'disabled="disabled"' : '',
                    card: this.params.card || {},
                    isAdd: !!this.params.isAdd
                };

                this.render(data);
            }
        });


        return WidgetEditCard;
    }
);