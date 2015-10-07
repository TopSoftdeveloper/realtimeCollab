var apiUtil = require('../apiUtils/apiUtil');
var ProjectActions = require('../actions/ProjectActions');
var UserStore = require('../stores/UserStore');
var ProjectStore = require('../stores/ProjectStore');
var TaskService = require('../services/TaskService');

module.exports = {
    init: function() {
        apiUtil.getAllProjects(UserStore.getUserId()).done(function(res) {
            ProjectActions.initProjects(res.projects);
            if (ProjectStore.getProjects().length > 0) {
                TaskService.loadTasks(ProjectStore.getProjects()[0].id);
            }
        }).fail(function(e) {
            console.log(e);
        });
    }
};