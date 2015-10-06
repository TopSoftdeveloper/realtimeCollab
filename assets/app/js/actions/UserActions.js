var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    init: function() {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.INIT_USER_STORE
        });
    },
    logOut: function() {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.LOG_OUT
        });
    }
};
