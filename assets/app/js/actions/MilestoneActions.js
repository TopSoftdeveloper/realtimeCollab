var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var apiUtil = require('../apiUtils/apiUtil');

module.exports = {
    replaceMilestoneId: function(original, replacement) {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.REPLACE_MILESTONE_ID,
            original: original,
            replacement: replacement
        });
    },
    createMilestone: function(milestone) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CREATE_MILESTONE,
            milestone: milestone
        });
    },
    deleteMilestone: function(id) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.DELETE_TASK,
            id: id
        });
    }
};