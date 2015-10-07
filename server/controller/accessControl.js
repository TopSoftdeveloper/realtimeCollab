/**
 * This module provides methods to determine whether a user has the permissions
 * to access a particular resource
 */
var models = require('../data/models/modelManager');
var UserProject = models.UserProject;

module.exports = {
    isUserPartOfProject: function(user_id, project_id) {
        return UserProject.findOne({
            where: {
                user_id: user_id,
                project_id: project_id
            }
        }).then(function(result) {
            return result !== null;
        });
    }
};