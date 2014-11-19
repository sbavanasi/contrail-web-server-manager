/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'knockback'
], function (_, Backbone, Knockback) {
    var prefixId = smwc.BAREMETAL_PREFIX_ID,
        modalId = 'configure-' + prefixId,
        editTemplate = contrail.getTemplate4Id(smwc.TMPL_BM_EDIT_FORM);

    var selectedBaremetal = null;
    
    var BaremetalEditView = Backbone.View.extend({
        modalElementId: '#' + modalId,
        
        renderAddBaremetal: function (options) {
            var editLayout = editTemplate({prefixId: prefixId}),
                that = this;

            smwu.createWizardModal({'modalId': modalId, 'className': 'modal-840', 'title': options['title'], 'body': editLayout, 'onSave': function () {
            }, 'onCancel': function () {
                Knockback.release(that.model, document.getElementById(modalId));
                smwv.unbind(that);
                $("#" + modalId).find('.contrailWizard').data('contrailWizard').destroy();
                $("#" + modalId).modal('hide');
            }});

            smwu.renderView4Config($("#" + modalId).find("#bm-" + prefixId + "-form"), this.model, 
                    getAddBaremetalViewConfig(that.model, options['callback']), smwc.KEY_ADD_VALIDATION);

            this.model.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_CREATE_CONFIG]) + smwc.FORM_SUFFIX_ID, false);
            this.model.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_ASSIGN_ROLES, smwl.TITLE_SELECT_SERVERS]) + smwc.FORM_SUFFIX_ID, false);

            Knockback.applyBindings(this.model, document.getElementById(modalId));
            smwv.bind(this);
        },
    });
    var gridConfig = {
            header: {
                title: {
                    text: smwl.TITLE_SELECT_SERVERS
                }
            },
            columnHeader : {
                columns : [
                       {
                           id : 'name',
                           field : 'name',
                           name : 'Name' ,
                           cssClass :'cell-hyperlink-blue'
                       },
                       {
                           id : 'ip',
                           field : 'ip',
                           name : 'IP' ,
                           cssClass :'cell-hyperlink-blue'
                       }
                 ]
            },
            body : {
                options : {         
                    forceFitColumns: true,
                },
                dataSource : {
                    data : [{'name':'Server1','ip':'1.1.1.1'},
                            {'name':'Server2','ip':'2.2.2.2'}]
                }
            },
            statusMessages: {
                loading: {
                    text: 'Loading Baremetals..'
                },
                empty: {
                    text: 'No Baremetals.'
                }, 
                errorGettingData: {
                    type: 'error',
                    iconClasses: 'icon-warning',
                    text: 'Error in getting Baremetals.'
                }
            }
    };
    
    var selectServerViewConfig = [{
        elementId: smwu.formatElementId([prefixId, smwl.TITLE_SELECT_BAREMETAL_SERVER]),
        title: smwl.TITLE_SELECT_BAREMETAL_SERVER,
        view: "SectionView",

        viewConfig: {
            rows: [
                {
                    columns: [
                        {
                            elementId: 'select-baremetal-filtered-servers',
                            view: "FormGridView",
                            viewConfig: {
                                path: 'id',
                                class: "span12",
                                elementConfig: getSelectedServerGridElementConfig('select-baremetal', 'filterInNull=cluster_id')
                            }
                        }
                    ]
                }
            ]
        }
    }];      
    
    var configureServerViewConfig = [{
        elementId: smwu.formatElementId([prefixId, smwl.TITLE_SELECT_INTERFACE]),
        title: smwl.TITLE_SELECT_INTERFACE,
        view: "SectionView",
        viewConfig: {
            rows: [
                {
                    columns : [

                               {
                                   elementId: 'baremetal-interfaces-grid',
                                   view: "FormDynamicGridView",
                                   viewConfig: {
                                       path: 'network.interfaces',
                                       class: "span12",
                                       modelAttributePath: 'network.interfaces',
                                       elementConfig: {
                                           options: {
                                               uniqueColumn: 'name',
                                               events: {
                                                   onUpdate: function () {
                                                       /*var interfaces = $('#baremetal-interfaces-grid').data('contrailDynamicgrid')._grid.getData(),
                                                           managementInterfacePrevData = $('#management_interface_dropdown').data('contrailDropdown').getAllData(),
                                                           managementInterfaceData = [],
                                                           controlDataInterfacePrevData = $('#control_data_interface_dropdown').data('contrailDropdown').getAllData(),
                                                           controlDataInterfaceData = [],
                                                           bondMemberInterfaces = [];

                                                       $.each(interfaces, function(interfaceKey, interfaceValue) {
                                                           bondMemberInterfaces = bondMemberInterfaces.concat(interfaceValue.member_interfaces);
                                                       });

                                                       $.each(interfaces, function (interfaceKey, interfaceValue) {
                                                           if (interfaceValue.name != '' && bondMemberInterfaces.indexOf(interfaceValue.name) == -1) {
                                                               if (interfaceValue.type == 'physical') {
                                                                   managementInterfaceData.push({
                                                                       id: interfaceValue.name,
                                                                       text: interfaceValue.name
                                                                   });
                                                               }

                                                               controlDataInterfaceData.push({
                                                                   id: interfaceValue.name,
                                                                   text: interfaceValue.name
                                                               });
                                                           }
                                                       });

                                                       if (JSON.stringify(managementInterfacePrevData) != JSON.stringify(managementInterfaceData)) {
                                                           $('#management_interface_dropdown').data('contrailDropdown').setData(managementInterfaceData)
                                                       }
                                                       if (JSON.stringify(controlDataInterfacePrevData) != JSON.stringify(controlDataInterfaceData)) {
                                                           $('#control_data_interface_dropdown').data('contrailDropdown').setData(controlDataInterfaceData)
                                                       }*/
                                                   }
                                               }
                                           },
                                           columns: [
                                                {
                                                    id: "name", name: "Name", field: "name", width: 85,
                                                    editor: ContrailGrid.Editors.Text,
                                                    formatter: ContrailGrid.Formatters.Text,
                                                    elementConfig: {
                                                        placeholder: 'Not required'
                                                    }
                                                },
                                               {
                                                   id: "baremetal_interface", name: "Interface", field: "interface", width: 250,
                                                   //defaultValue: 'physical',
                                                   editor: ContrailGrid.Editors.ContrailDropdown,
                                                   elementConfig: {
                                                       width: 'element',
                                                       placeholder: 'Select Interface',
                                                       dataTextField: "text",
                                                       dataValueField: "value",
//                                                       data: smwc.INTERFACE_TYPES
                                                       data : function(){
                                                           if($('#select-baremetal-filtered-servers').length > 0){
                                                               var checkedRows =  $('#select-baremetal-filtered-servers').data('contrailGrid').getCheckedRows();
                                                               var selectedServer = checkedRows[0];
                                                               return [{text:'Intf1', value:'intf1'}];
                                                           } else {
                                                               return [{text:'No Interfaces found', value:'None'}];
                                                           }
                                                       }()
                                                       
                                                   }

                                               },
                                               {
                                                   id: "vn", name: "Virtual Network", field: "vn", width: 250,
                                                   //defaultValue: 'physical',
                                                   editor: ContrailGrid.Editors.ContrailDropdown,
                                                   elementConfig: {
                                                       width: 'element',
                                                       placeholder: 'Select Network',
                                                       dataTextField: "text",
                                                       dataValueField: "value",
                                                       dataSource : {
                                                           type : 'remote',
                                                           url : smwc.URL_NETWORKS,
                                                           parse: function(result){
                                                               var vnDataSrc = [{text : 'None', value : 'none'}];
                                                               if(result != null && result['data'] != null && result['data'].length > 0) {
                                                                   var vns =  result['data'];
                                                                   for(var i = 0; i < vns.length; i++) {
                                                                       var vn = vns[i]['virtual-network'];
                                                                       var fqn = vn.fq_name;
                                                                       var subnetStr = '';
                                                                       if('network_ipam_refs' in vn) {
                                                                           var ipamRefs = vn['network_ipam_refs'];
                                                                           for(var j = 0; j < ipamRefs.length; j++) {
                                                                               if('subnet' in ipamRefs[j]) {
                                                                                   if(subnetStr === '') {
                                                                                       subnetStr = ipamRefs[j].subnet.ipam_subnet;
                                                                                   } else {
                                                                                       subnetStr += ', ' + ipamRefs[j].subnet.ipam_subnet;
                                                                                   }
                                                                               }
                                                                           }
                                                                       }
                                                                       var textVN = fqn[2] + " (" + fqn[0] + ":" + fqn[1] + ")";
                                                                       if(subnetStr != '') {
                                                                           textVN += ' (' + subnetStr + ')';  
                                                                       }
                                                                       vnDataSrc.push({ text : textVN, value : vn.uuid});
                                                                   }
                                                               } else {
                                                                   vnDataSrc.push({text : 'No Virtual Network found', value : 'empty'});
                                                               }
                                                               return vnDataSrc;
                                                           }
                                                       }
                                                   }
                                               }
                                           ]
                                       }
                                   }
                               }
                           
                    ]
                }
            ]
        }
    
    },
    {
        elementId: smwu.formatElementId([prefixId, smwl.TITLE_SELECT_IMAGE]),
        title: smwl.TITLE_SELECT_IMAGE,
        view: "SectionView",
        viewConfig: {
            rows: [
                {
                    columns: [
                        {
                            elementId: 'package_image_id',
                            view: "FormDropdownView",
                            viewConfig : {
                                path : 'package_image_id',
                                class : "span6",
                                dataBindValue : 'package_image_id',
                                elementConfig : {
                                    placeholder : smwl.SELECT_PACKAGE,
                                    dataTextField : "id",
                                    dataValueField : "id",
                                    dataSource : {
                                        type : 'remote',
                                        url : smwu
                                                .getObjectDetailUrl(
                                                        smwc.IMAGE_PREFIX_ID,
                                                        'filterInImages')
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    }];

    var configureInterfacesViewConfig = [{
        elementId: smwu.formatElementId([prefixId, smwl.TITLE_CONFIGURE_INTERFACES]),
        title: smwl.TITLE_CONFIGURE_INTERFACES,
        view: "SectionView",
        viewConfig: {
            rows: [
                {
                    columns: [
                           {
                            elementId : 'interface',
                            view : "FormDropdownView",
                            viewConfig : {
                                path : 'parameters.server',
                                dataBindValue : 'parameters().servers',
                                class : "span6",
                                elementConfig : {
                                    dataTextField : "text",
                                    dataValueField : "id",
                                    data : smwc.STATES
                                }
                            }
                        },
                    ]
                }
            ]
        }
    }];
    
    function getAddBaremetalViewConfig(baremetalModel, callback) {
        var addBaremetalViewConfig = {
                elementId: smwu.formatElementId([prefixId, smwl.TITLE_SELECT_BAREMETAL_SERVER]),
                view: "WizardView",
                viewConfig: {
                    steps: []
                }
            },
            steps = [],
            selectServerStepViewConfig = null,
            configureServerStepViewConfig = null,
            configureInterfacesStepViewConfig = null;
        
        /*
        Appending Select Server Steps
        */
        selectServerStepViewConfig = [{
            elementId: smwu.formatElementId([prefixId, smwl.TITLE_SELECT_SERVER]),
            view: "AccordianView",
            viewConfig: selectServerViewConfig,
            title: smwl.TITLE_SELECT_SERVER,
            stepType: 'step',
            onInitRender: true,
            onNext: function (params) {
                var checkedRows =  $('#select-baremetal-filtered-servers').data('contrailGrid').getCheckedRows();
                if(checkedRows.length == 0){
                    baremetalModel.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_SELECT_BAREMETAL_SERVER]) + smwc.FORM_SUFFIX_ID, false);
                    return false
                } else if(checkedRows > 1){
                    baremetalModel.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_SELECT_BAREMETAL_SERVER]) + smwc.FORM_SUFFIX_ID, false);
                    return false;
                } else {
                    baremetalModel.selectedServer = checkedRows[0];
                    var interfacedd = $('#baremetal_interface').data('contrailDropdown');
//                    interfacedd.setData
                }
                return true;
            },
            buttons: {
                next: {
                    label: smwl.TITLE_NEXT
                },
                previous: {
                    visible: false
                }
            }
        }];
        steps = steps.concat(selectServerStepViewConfig);
        
        /*
        Appending Configure Server Steps
        */
        configureServerStepViewConfig = [{
                elementId: smwu.formatElementId([prefixId, smwl.TITLE_CONFIGURE_SERVER]),
                view: "AccordianView",
                viewConfig: configureServerViewConfig,
                title: smwl.TITLE_CONFIGURE_SERVER,
                stepType: 'step',
                onInitRender: true,
                onNext: function (params) {
                    return params.model.configureBaremetal({
                        init: function () {
                            baremetalModel.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_EDIT_CONFIG]) + smwc.FORM_SUFFIX_ID, false);
                            smwu.enableModalLoading(modalId);
                        },
                        success: function () {
                            smwu.disableModalLoading(modalId, function () {
                                callback();
                                $('#' + modalId).modal('hide');
                            });
                        },
                        error: function (error) {
                            smwu.disableModalLoading(modalId, function () {
                                baremetalModel.showErrorAttr(smwu.formatElementId([prefixId, smwl.TITLE_EDIT_CONFIG]) + smwc.FORM_SUFFIX_ID, error.responseText);
                            });
                        }
                    });
                },
                buttons: {
                    finish: {
                        label: 'Save'
                    },
                    previous: {
                        visible: false
                    }
                }
            }];
        steps = steps.concat(configureServerStepViewConfig);
        
        /*
        Appending Configure Interfaces Steps
        */
        /*configureInterfacesStepViewConfig = [{
            elementId: smwu.formatElementId([prefixId, smwl.TITLE_CONFIGURE_INTERFACES]),
            view: "AccordianView",
            viewConfig: configureInterfacesViewConfig,
            title: smwl.TITLE_CONFIGURE_INTERFACES,
            stepType: 'step',
            onInitRender: false,
            onNext: function (params) {
                //TODO
                return true;
            },
            buttons: {
                finish: {
                    label: 'Save'
                },
                previous: {
                    visible: true
                }
            }
        }];
        steps = steps.concat(configureInterfacesStepViewConfig);
        */
        
        addBaremetalViewConfig.viewConfig.steps = steps;

        return addBaremetalViewConfig;
    }
    
    function getSelectedServerGridElementConfig(gridPrefix, urlParam) {
        var filteredServerGrid = '#' + gridPrefix + '-filtered-servers',
            gridElementConfig = {
            header: {
                title: {
                    text: smwl.TITLE_SELECT_SERVERS
                },
                defaultControls: {
                    refreshable: true
                },
                advanceControls: [
                    /*{
                        "type": "link",
                        "title": 'Select Servers',
                        "iconClass": "icon-plus",
                        "onClick": function () {
                            var checkedRows = $(filteredServerGrid).data('contrailGrid').getCheckedRows();
                            updateSelectedServer(gridPrefix, 'add', checkedRows);
                        }
                    }, */
                    {
                        type: 'checked-multiselect',
                        iconClass: 'icon-filter',
                        title: 'Filter Servers',
                        placeholder: 'Filter Servers',
                        elementConfig: {
                            elementId: 'tagsCheckedMultiselect',
                            dataTextField: 'text',
                            dataValueField: 'id',
                            filterConfig: {
                                placeholder: 'Search Tags'
                            },
                            parse: formatData4Ajax,
                            minWidth: 200,
                            height: 250,
                            emptyOptionText: smwm.NO_TAGS_FOUND,
                            dataSource: {
                                type: 'GET',
                                url: smwu.getTagsUrl('')
                            },
                            click: function(event, ui){
                                applyServerTagFilter(filteredServerGrid, event, ui)
                            },
                            optgrouptoggle: function(event, ui){
                                applyServerTagFilter(filteredServerGrid, event, ui)
                            },
                            control: false
                        }
                    }
                ]

            },
            columnHeader: {
                columns: smwgc.EDIT_SERVERS_ROLES_COLUMNS
            },
            body: {
                /*options: {
                    actionCell: {
                        type: 'link',
                        iconClass: 'icon-plus',
                        onclick: function(e, args) {
                            var selectedRow = $(filteredServerGrid).data('contrailGrid')._dataView.getItem(args.row);
                            updateSelectedServer(gridPrefix, 'add', [selectedRow]);
                        }
                    }
                },*/
                dataSource: {
                    remote: {
                        ajaxConfig: {
                            url: smwu.getObjectDetailUrl(smwc.SERVER_PREFIX_ID) + '?' + urlParam
                        }
                    }
                },
                statusMessages: {
                    empty: {
                        type: 'status',
                        iconClasses: '',
                        text: smwm.NO_SERVERS_2_SELECT
                    }
                }
            }
        };
        return gridElementConfig;
    }
    
    function formatData4Ajax(response) {
        var filterServerData = [];
        $.each(response, function (key, value) {
            var childrenData = [],
                children = value;
            $.each(children, function (k, v) {
                childrenData.push({'id': v, 'text': v});
            });
            filterServerData.push({'id': key, 'text': smwl.get(key), children: childrenData});
        });
        return filterServerData;
    };
    
    function updateSelectedServer(gridPrefix, method, serverList){
        var filteredServerGridElement = $('#' + gridPrefix + '-filtered-servers'),
            confirmServerGridElement = $('#' + gridPrefix + '-confirm-servers'),
            currentSelectedServer = filteredServerGridElement.data('serverData').selectedServers,
            serverIds = filteredServerGridElement.data('serverData').serverIds;

        if(method == 'add') {
            var cgrids = [];
            currentSelectedServer = currentSelectedServer.concat(serverList);
            filteredServerGridElement.data('serverData').selectedServers = currentSelectedServer;

            $.each(serverList, function(serverListKey, serverListValue){
                cgrids.push(serverListValue.cgrid);
                serverIds.push(serverListValue.id);
            });
            filteredServerGridElement.data('contrailGrid')._dataView.deleteDataByIds(cgrids);
        }
        else if(method == 'remove') {
            var cgrids = [];

            $.each(serverList, function(serverListKey, serverListValue){
                cgrids.push(serverListValue.cgrid);
                serverIds.splice(serverIds.indexOf(serverListValue.id), 1 );
            });
            confirmServerGridElement.data('contrailGrid')._dataView.deleteDataByIds(cgrids);
            filteredServerGridElement.data('contrailGrid')._dataView.addData(serverList);
        }

        filteredServerGridElement.data('serverData').serverIds = serverIds;
        filteredServerGridElement.data('serverData').selectedServers = currentSelectedServer;
        filteredServerGridElement.parents('section').find('.selectedServerCount')
            .text((currentSelectedServer.length == 0) ? 'None' : currentSelectedServer.length);

        return true;
    }
    
    return BaremetalEditView;
});