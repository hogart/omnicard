define(
    [
        'Chitin'
    ],
    function (Chitin) {
        /**
         * Abstract storage (in localStorage)
         * @class Storage
         */
        var Storage = Chitin.Abstract.extend({
            defaults: {
                defaultVal: {}
            },

            initialize: function (options) {
                Storage.__super__.initialize.call(this, options);
            },

            save: function (data) {
                localStorage.setItem(this.params.key, JSON.stringify(data));
            },

            loadDump: function() {
                var loaded = localStorage.getItem(this.params.key),
                    result = this.params.defaultVal;

                if (loaded) {
                    try {
                        result = JSON.parse(loaded)
                    }
                    catch(e) {}
                }

                return result;
            }
        });

        return Storage;
    }
);