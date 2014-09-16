/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */

var coreConstants = require(process.mainModule.exports["corePath"] + '/src/serverroot/common/global'),
    smMessages = {};

smMessages.ERROR_REDIS_DB_SELECT = 'Redis DB ' + coreConstants.SM_DFLT_REDIS_DB + ' Select Error: {0}';

smMessages.get = function () {
    var args = arguments;
    return args[0].replace(/\{(\d+)\}/g, function (m, n) {
        n = parseInt(n) + 1;
        return args[n];
    });
};

// Export this as a module.
module.exports = smMessages;