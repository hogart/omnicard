define(
    [
        'Widget/Abstract'
    ],
    function (WidgetAbstract) {
        'use strict';

        var WidgetDump = WidgetAbstract.extend({
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
                WidgetDump.__super__.initialize.call(this, options);

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

        return WidgetDump;
    }
);