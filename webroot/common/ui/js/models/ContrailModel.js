/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'knockout',
    'knockback'
], function (_, Backbone, Knockout, Knockback) {
    var ContrailViewModel = Knockback.ViewModel.extend({

        constructor: function (modelConfig) {
            var model, errorAttributes,
                editingLockAttrs, _this = this,
                modelAttributes = (modelConfig == null) ? this.defaultConfig : modelConfig;

            errorAttributes = generateAttributes(modelAttributes, smwc.ERROR_SUFFIX_ID, false);
            editingLockAttrs = generateAttributes(modelAttributes, smwc.LOCKED_SUFFIX_ID, true);

            modelConfig = $.extend(true, {}, this.defaultConfig, modelConfig, {errors: new Backbone.Model(errorAttributes), locks: new Backbone.Model(editingLockAttrs)});

            model = new Backbone.Model(modelConfig);
            model = _.extend(model, this.validations);

            Knockback.ViewModel.prototype.constructor.call(this, model);

            delete this.validations;
            return this;
        },

        getValueByPath: function (path) {
            var obj = this.model().attributes;
            path = path.replace(/\[(\w+)\]/g, '.$1');
            path = path.replace(/^\./, '');
            var pathArray = path.split('.');
            while (pathArray.length) {
                var property = pathArray.shift();
                if (obj != null && property in obj) {
                    obj = obj[property];
                } else {
                    return;
                }
            }
            return obj;
        },

        validateAttr: function (attributePath, validation) {
            var attr = getAttributeFromPath(attributePath),
                errors = this.model().get(smwc.KEY_MODEL_ERRORS),
                attrErrorObj = {}, isValid;

            isValid = this.model().isValid(attributePath, validation);
            attrErrorObj[attr + smwc.ERROR_SUFFIX_ID] = (isValid == true) ? false : isValid;
            errors.set(attrErrorObj);
        },

        initLockAttr: function (attributePath, lockFlag) {
            var attribute = getAttributeFromPath(attributePath),
                locks = this.model().get(smwc.KEY_MODEL_LOCKS),
                errors = this.model().get(smwc.KEY_MODEL_ERRORS),
                lockObj = {}, attrErrorObj = {};

            lockObj[attribute + smwc.LOCKED_SUFFIX_ID] = lockFlag;
            locks.set(lockObj);

            attrErrorObj[attribute + smwc.ERROR_SUFFIX_ID] = false
            errors.set(attrErrorObj);
        },

        toggleLockAttr: function(attributePath) {
            var attribute = getAttributeFromPath(attributePath),
                locks = this.model().get(smwc.KEY_MODEL_LOCKS),
                lockedStatus = locks.attributes[attribute + smwc.LOCKED_SUFFIX_ID],
                lockObj = {};

            lockObj[attribute + smwc.LOCKED_SUFFIX_ID] = !lockedStatus;
            locks.set(lockObj);
        },

        showErrorAttr: function(attributePath, msg) {
            var attribute = getAttributeFromPath(attributePath),
                errors = this.model().get(smwc.KEY_MODEL_ERRORS),
                errorObj = {};

            errorObj[attribute + smwc.ERROR_SUFFIX_ID] = msg;
            errors.set(errorObj);
        },

        checkIfInputDisabled: function(disabledFlag, lockFlag) {
            return disabledFlag || lockFlag;
        },

        getFormErrorText: function (prefixId) {
            var modelErrors = this.model().attributes.errors.attributes,
                errorText = smwm.get(smwm.SHOULD_BE_VALID, smwl.get(prefixId));

            _.each(modelErrors, function (value, key) {
                if (_.isFunction(modelErrors[key]) || (modelErrors[key] == 'false') || (modelErrors[key] == '')) {
                    delete modelErrors[key];
                } else {
                    if (-1 == (key.indexOf('_form_error'))) {
                        errorText = errorText + smwl.getFirstCharUpperCase(key.split('_error')[0]) + ", ";
                    }
                }
            });
            // Replace last comma by a dot
            errorText = errorText.slice(0, -2) + ".";
            return {responseText: errorText};
        }
    });

    var generateAttributes = function (attributes, suffix, defaultValue) {
        var flattenAttributes = smwu.flattenObject(attributes),
            errorAttributes = {};

        _.each(flattenAttributes, function (value, key) {
            var keyArray = key.split('.');
            errorAttributes[keyArray[keyArray.length - 1] + suffix] = defaultValue;
        });

        return errorAttributes;
    };

    var getAttributeFromPath = function (attributePath) {
        var attributePathArray = attributePath.split('.'),
            attribute = attributePathArray[attributePathArray.length - 1];

        return attribute;
    };

    return ContrailViewModel;
});