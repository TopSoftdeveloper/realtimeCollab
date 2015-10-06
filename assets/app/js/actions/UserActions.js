var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    update: function(store) {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.UPDATE_USER_STORE,
            store: store
        });
    }
};
