/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore'
], function (_) {
    var GridConfig = function () {
        this.GRID_HEADER_ACTION_TYPE_ACTION = 'action';
        this.GRID_HEADER_ACTION_TYPE_DROPLIST = 'action-droplist';

        this.IMAGE_COLUMNS = [
            { id: "image_id", field: "id", name: "Name", width: 120, minWidth: 15 },
            { id: "category", field: "category", name: "Category", width: 120, minWidth: 15 },
            { id: "image_type", field: "type", name: "Type", width: 120, minWidth: 15 },
            { id: "image_version", field: "version", name: "Version", width: 120, minWidth: 15 },
            { id: "image_path", field: "path", name: "Path", width: 300, minWidth: 15 }
        ];

        this.PACKAGE_COLUMNS = [
            { id: "package_id", field: "id", name: "Name", width: 120, minWidth: 15 },
            { id: "package_category", field: "category", name: "Category", width: 120, minWidth: 15 },
            { id: "package_type", field: "type", name: "Type", width: 120, minWidth: 15 },
            { id: "package_version", field: "version", name: "Version", width: 120, minWidth: 15 },
            { id: "package_path", field: "path", name: "Path", width: 300, minWidth: 15 }
        ];

        this.CLUSTER_COLUMNS = [
            { id: "cluster_id", field: "id", name: "Name", width: 120, minWidth: 15, cssClass: 'cell-hyperlink-blue', events: {
                onClick: function (e, dc) {
                    loadFeature({p: 'setting_sm_clusters', q: {'cluster_id': dc['id']}});
                }
            }},
            { id: "email", field: "email", name: "Email", width: 120, minWidth: 15 },
            { id: "new-servers", field: "", name: "New Servers", width: 120, minWidth: 15, sortable : {sortBy: 'formattedValue'},
                formatter: function (r, c, v, cd, dc) {
                    var uiParams = dc[smwc.KEY_UI_ADDED_PARAMS],
                        serverStatus = uiParams['servers_status'];
                    return serverStatus['new_servers'];
                }
            },
            { id: "configured-servers", field: "", name: "Configured Servers", width: 120, minWidth: 15, sortable : {sortBy: 'formattedValue'},
                formatter: function (r, c, v, cd, dc) {
                    var uiParams = dc[smwc.KEY_UI_ADDED_PARAMS],
                        serverStatus = uiParams['servers_status'];
                    return serverStatus['configured_servers'];
                }
            },
            { id: "inprovision_servers", field: "", name: "In-Provision Servers", width: 120, minWidth: 15, sortable : {sortBy: 'formattedValue'},
                formatter: function (r, c, v, cd, dc) {
                    var uiParams = dc[smwc.KEY_UI_ADDED_PARAMS],
                        serverStatus = uiParams['servers_status'];
                    return serverStatus['inprovision_servers'];
                }
            },
            { id: "provisioned-servers", field: "", name: "Provisioned Servers", width: 120, minWidth: 15, sortable : {sortBy: 'formattedValue'},
                formatter: function (r, c, v, cd, dc) {
                    var uiParams = dc[smwc.KEY_UI_ADDED_PARAMS],
                        serverStatus = uiParams['servers_status'];
                    return serverStatus['provisioned_servers'];
                }
            },
            { id: "total-servers", field: "", name: "Total Servers", width: 120, minWidth: 15, sortable : {sortBy: 'formattedValue'},
                formatter: function (r, c, v, cd, dc) {
                    var uiParams = dc[smwc.KEY_UI_ADDED_PARAMS],
                        serverStatus = uiParams['servers_status'];
                    return serverStatus['total_servers'];
                }
            }
        ];

        this.getConfigureAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_EDIT_CONFIG,
                iconClass: 'icon-edit',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getAddServersAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_ADD_SERVERS,
                iconClass: 'icon-plus',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getRemoveServersAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_REMOVE_SERVERS,
                iconClass: 'icon-minus',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getReimageAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_REIMAGE,
                iconClass: 'icon-upload-alt',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getProvisionAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_PROVISION,
                iconClass: 'icon-cloud-upload',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getTagAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_EDIT_TAGS,
                iconClass: 'icon-tags',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getAssignRoleAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_ASSIGN_ROLES,
                iconClass: 'icon-check',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getDeleteAction = function (onClickFunction, divider) {
            return {
                title: smwl.TITLE_DELETE,
                iconClass: 'icon-trash',
                width: 80,
                divider: contrail.checkIfExist(divider) ? divider : false,
                onClick: onClickFunction
            };
        };

        this.getGridColumns4Roles = function () {
            var columns = [];
            $.each(smwc.ROLES_ARRAY, function(roleKey, roleValue) {
                columns.push({
                    id: roleValue, field: "roles",
                    name: smwl.get(roleValue),
                    width: 60, minWidth: 60,
                    cssClass: 'text-center',
                    formatter: function (r, c, v, cd, dc) {
                        if($.isEmptyObject(dc.roles)) {
                            return ''
                        } else {
                            return (dc.roles.indexOf(roleValue) != -1) ? '<i class="icon-ok green"></i>' : '';
                        }
                    },
                    exportConfig: {
                        allow: true,
                        advFormatter: function(dc) {
                            return (dc.roles.indexOf(roleValue) != -1);
                        }
                    }
                });
            })
            return columns;
        };

        this.EDIT_SERVERS_ROLES_COLUMNS = ([
            { id: "server_id", field: "id", name: "Hostname", width: 75, minWidth: 75 },
            {
                id: "tag", field: "tag", name: "Tags", width: 125, minWidth: 125,
                formatter: function (r, c, v, cd, dc) {
                    var tagTemplate = contrail.getTemplate4Id("sm-tags-template"),
                        tagHTML = tagTemplate({tags: dc.tag, colors: smwc.CACHED_TAG_COLORS, allowLink: false});
                    return tagHTML;
                },
                exportConfig: {
                    allow: true,
                    advFormatter: function(dc) {
                        return JSON.stringify(dc.tag);
                    }
                }
            }
        ]);

        this.getServerColumns = function (serverColumnsType) {
            var serverColumns,
                commonColumnsSet1 = [
                    { id: "discovered", field: "discovered", resizable: false, sortable: false, width: 30,
                        searchable: false, exportConfig: { allow: false }, formatter: function (r, c, v, cd, dc) {
                        if (dc['discovered'] == true) {
                            return '<div class="padding-2-0;"><i class="icon-circle blue"></i></div>';
                        }
                    }
                    },
                    { id: "server_id", field: "id", name: "ID", width: 80, minWidth: 15, cssClass: 'cell-hyperlink-blue', events: {
                        onClick: function (e, dc) {
                            loadFeature({p: 'setting_sm_servers', q: {'server_id': dc['id']}});
                        }
                    } }
                ],
                commonColumnsSet2 = [
                    {
                        id: "tag", field: "tag", name: "Tags", width: 150, minWidth: 150,
                        formatter: function (r, c, v, cd, dc) {
                            var tagTemplate = contrail.getTemplate4Id("sm-tags-template"),
                                tagHTML = tagTemplate({tags: dc.tag, colors: smwc.CACHED_TAG_COLORS, allowLink: true});
                            return tagHTML;
                        },
                        exportConfig: {
                            allow: true,
                            advFormatter: function(dc) {
                                return JSON.stringify(dc.tag);
                            }
                        }
                    },
                    { id: "ip_address", field: "ip_address", name: "IP", width: 80, minWidth: 15 },
                    { id: "ipmi_address", field: "ipmi_address", name: "IPMI", width: 80, minWidth: 15, cssClass: 'cell-hyperlink-blue', events: {
                        onClick: function (e, dc) {
                            if(dc['ipmi_address'] != null && dc['ipmi_address'] != '') {
                                window.open("http://" + dc['ipmi_address']);
                            }
                        }
                    }}
                ];

            if (serverColumnsType == smwc.SERVER_PREFIX_ID) {
                serverColumns = commonColumnsSet1.concat([
                    { id: "cluster_id", field: "cluster_id", name: "Cluster", width: 80, minWidth: 15, cssClass: 'cell-hyperlink-blue', events: {
                        onClick: function (e, dc) {
                            loadFeature({p: 'setting_sm_clusters', q: {'cluster_id': dc['cluster_id']}});
                        }
                    }}
                ]);
                serverColumns = serverColumns.concat(commonColumnsSet2);
            } else if (serverColumnsType == smwc.CLUSTER_PREFIX_ID) {
                serverColumns = commonColumnsSet1.concat(commonColumnsSet2).concat(this.getGridColumns4Roles());
            }
            serverColumns = serverColumns.concat([
                { id: "status", field: "status", name: "Status", width: 120, minWidth: 15 }
            ]);

            return serverColumns;
        };
    }

    return GridConfig;
});