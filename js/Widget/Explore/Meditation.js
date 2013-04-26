define(
    [
        'Widget/Explore/Abstract'
    ],
    function (WidgetExploreAbstract) {
        'use strict';

        var WidgetExploreMeditation = WidgetExploreAbstract.extend({
            tpl: 'testMeditation',

            events: {
                'click .js-next': 'next'
            },

            final: function () {
                this.$el.trigger('meditationOver');
            }
        });

        return WidgetExploreMeditation;
    }
);