var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var apiUtil = require('../apiUtils/apiUtil');

module.exports = {
    loadTasks: function(milestones) {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.LOAD_TASKS,
            milestones: milestones
        });
    },
    replaceTaskId: function(original, replacement) {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.REPLACE_TASK_ID,
            original: original,
            replacement: replacement
        });
    },
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