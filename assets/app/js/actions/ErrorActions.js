var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    addTaskFail: function(task_id) { // task store can listen to this to delete the id;
        // error store can listen to this to update UI
        AppDispatcher.handleServerAction({
            actionType: AppConstants.ADD_TASK_FAIL,
            task_id: task_id
        });
    }
};