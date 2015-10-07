var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');

module.exports = {
    initProjects: function(projects) {
        AppDispatcher.handleServerAction({
            actionType: AppConstants.INIT_PROJECT_STORE,
            projects: projects
        });
    }
};