/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'knockout'
], function (_, Backbone, Knockout) {
    var AccordianView = Backbone.View.extend({
        render: function () {
            var accordianTempl = contrail.getTemplate4Id(smwc.TMPL_ACCORDIAN_VIEW),
                viewConfig = this.attributes.viewConfig,
                elId = this.attributes.elementId,
                validation = this.attributes.validation,
                lockEditingByDefault = this.attributes.lockEditingByDefault,
                errorObj = this.model.model().get(smwc.KEY_MODEL_ERRORS),
                childViewObj, childElId, childElIdArray;

            this.$el.html(accordianTempl({viewConfig: viewConfig, elementId: elId}));

            for (var i = 0; i < viewConfig.length; i++) {
                childViewObj = viewConfig[i];
                childElId = childViewObj[smwc.KEY_ELEMENT_ID];

                this.model.showErrorAttr(childElId, getKOComputedError(viewConfig[i], this));

                smwu.renderView4Config(this.$el.find("#" + childElId), this.model, childViewObj, validation, lockEditingByDefault);
            }

            this.$el.find("#" + elId).accordion({
                heightStyle: "content",
                collapsible: true
            });
        }
    });

    var getKOComputedError = function (childViewObj, that) {
        var childElIdArray = getElementIds4Section(childViewObj[smwc.KEY_VIEW_CONFIG]),
            koComputedFunc = Knockout.computed(function () {
                var value = false;
                for(var i = 0; i < childElIdArray.length; i ++) {
                    var item = childElIdArray[i],
                        errorName = item + smwc.ERROR_SUFFIX_ID;
                    if(item != null && this.model.errors()[errorName] != null) {
                        var idError = this.model.errors()[errorName]();

                        if (idError) {
                            value = true;
                        }
                    }
                };
                return value;
            }, that);

        return koComputedFunc;
    };

    var getElementIds4Section = function (sectionConfig) {
        var rows = sectionConfig[smwc.KEY_ROWS],
            columns, elementIds = [];
        for (var i = 0; i < rows.length; i++) {
            columns = rows[i][smwc.KEY_COLUMNS];
            for (var j = 0; j < columns.length; j++) {
                elementIds.push(columns[j][smwc.KEY_ELEMENT_ID]);
            }
        }
        return elementIds;
    };

    return AccordianView;
});