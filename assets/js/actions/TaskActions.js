var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    addTask: function(task) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.ADD_TASK,
            task: task
        });
    },
    deleteTask: function(id) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.DELETE_TASK,
            id: id
        });
    },
    markDone: function (id) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.MARK_DONE,
            id: id
        });
    }
};