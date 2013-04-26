define(
    [
        'Chitin',
        '_'
    ],
    function (Chitin, _) {
        /**
         * Something storable in localStorage via {@link Storage}
         * @class Storable
         */
        var Storable = Chitin.Observable.extend({
            initialize: function (options) {
                Storable.__super__.initialize.call(this, options);

                this.storage = new this.params.storage({key: this.params.key});
                this.attrs = _.extend({}, this.params.attrs, this.storage.loadDump());
            },

            get: function (key, defaultVal) {
                return key in this.attrs ? this.attrs[key] : defaultVal;
            },

            set: function (attrs, options) {
                _.extend(this.attrs, attrs);
                this.save();

                options || (options = {silent: false});

                if (!options.silent) {
                    this.trigger('update');
                }

                return this;
            },

            reset: function (options) {
                this.attrs = {};
                this.save();

                options || (options = {silent: false});

                if (!options.silent) {
                    this.trigger('update');
                }

                return this;
            },

            save: function () {
                this.storage.save(this.attrs);
            }
        });

        return Storable;
    }
);