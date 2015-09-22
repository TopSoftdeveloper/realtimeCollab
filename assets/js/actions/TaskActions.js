var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    addTask: function(task) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.ADD_TASK,
            task: task
        });
    },
    deleteTask: function(task) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.DELETE_TASK,
            task: task
        });
    },
    markDone: function (task) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.MARK_DONE,
            task: task
        });
    }
};