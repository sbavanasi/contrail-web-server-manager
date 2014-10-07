/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'common/ui/js/models/ContrailModel'
], function (_, ContrailModel) {
    var ServerModel = ContrailModel.extend({
        defaultConfig: {
            'id': null,
            'cluster_id': null,
            'domain': null,
            'discovered': null,
            'gateway': null,
            'email': null,
            'subnet_mask': null,
            'static_ip': null,
            'mac_address': null,
            'base_image_id': null,
            'package_image_id': null,
            'ip_address': null,
            'password': null,
            'ipmi_address': null,
            'ipmi_username': null,
            'ipmi_password': null,
            'host_name': null,
            'intf_data': null,
            'intf_bond': null,
            'intf_control': null,
            'parameters': {},
            'tag': {},
            'roles': {}
        },
        configure: function (modalId, checkedRows, callback) {
            if (this.model().isValid(true, 'configureValidation')) {
                // TODO: Check for form-level validation if required
                var ajaxConfig = {};
                if (true) {
                    var putData = {}, serverAttrsEdited = [], serversEdited = [],
                        serverAttrs = this.model().attributes,
                        locks = this.model().attributes.locks.attributes;

                    serverAttrsEdited = smUtils.getEditConfigObj(serverAttrs, locks);
                    for (var i = 0; i < checkedRows.length; i++) {
                        serversEdited.push(serverAttrsEdited);
                    }
                    putData[smConstants.SERVER_PREFIX_ID] = serversEdited;

                    ajaxConfig.type = "PUT";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = smUtils.getObjectUrl(smConstants.SERVER_PREFIX_ID);
                    console.log(ajaxConfig);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        configureServers: function (modalId, checkedRows, callback) {
            var ajaxConfig = {};
            if (true) {
                var putData = {}, serverAttrsEdited = {}, serversEdited = [],
                    serverAttrs = this.model().attributes,
                    locks = this.model().attributes.locks.attributes;

                serverAttrsEdited = smUtils.getEditConfigObj(serverAttrs, locks);
                $.each(checkedRows, function (checkedRowsKey, checkedRowsValue) {
                    serversEdited.push($.extend(true, {}, serverAttrsEdited, {id: checkedRowsValue.id}));
                });
                putData[smConstants.SERVER_PREFIX_ID] = serversEdited;

                ajaxConfig.type = "PUT";
                ajaxConfig.data = JSON.stringify(putData);
                ajaxConfig.url = smUtils.getObjectUrl(smConstants.SERVER_PREFIX_ID);
                console.log(ajaxConfig);
                contrail.ajaxHandler(ajaxConfig, function () {
                }, function (response) {
                    console.log(response);
                    $("#" + modalId).modal('hide');
                    if (contrail.checkIfFunction(callback)) {
                        callback();
                    }
                }, function (error) {
                    console.log(error);
                });
            } else {
                // TODO: Show form-level error message if any
            }
        },
        createServers: function (modalId, callback) {
            if (this.model().isValid(true, 'createServersValidation')) {
                var ajaxConfig = {};
                if (true) {
                    var putData = {}, serversCreated = [],
                        serverAttrs = this.model().attributes;
                        serversCreated.push(serverAttrs);

                    putData[smConstants.SERVER_PREFIX_ID] = serversCreated;

                    ajaxConfig.type = "PUT";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = smUtils.getObjectUrl(smConstants.SERVER_PREFIX_ID);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        editRoles: function (modalId, checkedRows, callback) {
            var ajaxConfig = {};
            if (this.model().isValid(true, 'configureValidation')) {
                if (true) {
                    var serverAttrs = this.model().attributes,
                        putData = {}, servers = [],
                        roles = serverAttrs['roles'].split(',');

                    for(var i = 0; i < checkedRows.length; i++) {
                        servers.push({'id': checkedRows[i]['id'], 'roles': roles});
                    }
                    putData[smConstants.SERVER_PREFIX_ID] = servers;

                    ajaxConfig.type = "PUT";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = smUtils.getObjectUrl(smConstants.SERVER_PREFIX_ID);
                    console.log(ajaxConfig);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        editTags: function (modalId, checkedRows, callback) {
            var ajaxConfig = {};
            if (this.model().isValid(true, 'configureValidation')) {
                // TODO: Check for form-level validation if required
                if (true) {
                    var serverAttrs = this.model().attributes,
                        putData = {}, servers = [];

                    for (var i = 0; i < checkedRows.length; i++) {
                        servers.push({'id': checkedRows[i]['id'], 'tag': serverAttrs['tag']});
                    }

                    putData[smConstants.SERVER_PREFIX_ID] = servers;

                    ajaxConfig.type = "PUT";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = smUtils.getObjectUrl(smConstants.SERVER_PREFIX_ID);
                    console.log(ajaxConfig);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        reimage: function (modalId, checkedRows, callback) {
            var ajaxConfig = {};
            if (this.model().isValid(true, 'reimageValidation')) {
                // TODO: Check for form-level validation if required
                if (true) {
                    var serverAttrs = this.model().attributes,
                        putData = {}, servers = [];

                    for (var i = 0; i < checkedRows.length; i++) {
                        servers.push({'id': checkedRows[i]['id'], 'base_image_id': serverAttrs['base_image_id']});
                    }
                    putData = servers;
                    ajaxConfig.type = "POST";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = 'sm/server/reimage';
                    console.log(ajaxConfig);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        provision: function (modalId, checkedRows, callback) {
            var ajaxConfig = {};
            if (this.model().isValid(true, 'provisionValidation')) {
                if (true) {
                    var serverAttrs = this.model().attributes,
                        putData = {}, servers = [];

                    for (var i = 0; i < checkedRows.length; i++) {
                        servers.push({'id': checkedRows[i]['id'], 'package_image_id': serverAttrs['package_image_id']});
                    }
                    putData = servers;

                    ajaxConfig.type = "POST";
                    ajaxConfig.data = JSON.stringify(putData);
                    ajaxConfig.url = '/sm/server/provision';
                    console.log(ajaxConfig);
                    contrail.ajaxHandler(ajaxConfig, function () {
                    }, function (response) {
                        console.log(response);
                        $("#" + modalId).modal('hide');
                        if (contrail.checkIfFunction(callback)) {
                            callback();
                        }
                    }, function (error) {
                        console.log(error);
                    });

                } else {
                    // TODO: Show form-level error message if any
                }
            }
        },
        validations: {
            reimageValidation: {},
            provisionValidation: {},
            createServersValidation: {
                'id': {
                    required: true,
                    msg: smMessages.getRequiredMessage('id')
                },
                'ip_address': {
                    required: true,
                    pattern: smConstants.PATTERN_IP_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('ip_address')
                },
                'mac_address': {
                    required: true,
                    pattern: smConstants.PATTERN_MAC_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('mac_address')
                }
            },
            configureValidation: {
                'email': {
                    required: false,
                    pattern: 'email',
                    msg: smMessages.getInvalidErrorMessage('email')
                },
                'gateway': {
                    required: false,
                    pattern: smConstants.PATTERN_IP_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('gateway')
                },
                'mac_address': {
                    required: true,
                    pattern: smConstants.PATTERN_MAC_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('mac_address')
                },
                'subnet_mask': {
                    required: false,
                    pattern: smConstants.PATTERN_IP_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('subnet_mask')
                },
                'parameters.compute_non_mgmt_ip': {
                    required: false,
                    pattern: smConstants.PATTERN_IP_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('compute_non_mgmt_ip')
                },
                'parameters.compute_non_mgmt_gway': {
                    required: false,
                    pattern: smConstants.PATTERN_IP_ADDRESS,
                    msg: smMessages.getInvalidErrorMessage('compute_non_mgmt_gway')
                }
            }
        }
    });

    return ServerModel;
});
