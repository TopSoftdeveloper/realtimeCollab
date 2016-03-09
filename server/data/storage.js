var constants = require('../constants');
var shortid = require('shortid');
var Promise = require("bluebird");
var models = require('./models/modelManager');
var Task = models.Task;
var Milestone = models.Milestone;
var User = models.User;
var Project = models.Project;
var UserProject = models.UserProject;
var Notification = models.Notification;

var format = require('string-format');

module.exports = {
    getNotifications: function(userId) {
        return Notification.findAll({
            where: {
                user_id: userId
            }
        })
    },

    saveNotification: function(data, template, userId) {
        return Notification.create({
            id: shortid.generate(),
            data: data,
            template: template,
            user_id: userId,
            is_read: false
        });
    },

    updateNotification: function(id, data) {
        return Notification.update(data, {
            where: {
                id: id
            }
        })
    },

    removeNotification: function(id) {
        return Notification.destroy({
            where: {
                id: id
            }
        });
    },

    inviteToProject: function(user_id, project_id) {
        return UserProject.create({
            user_id: user_id,
            project_id: project_id,
            role: constants.ROLE_PENDING
        });
    },

    joinProject: function(userId, projectId) {
        return UserProject.update({
            role: constants.ROLE_BASIC
        }, {
            where: {
                user_id: userId,
                project_id: projectId
            }
        })
    },
    updateProject: function(payload, projectId) {
        var project = {}
        if (payload.content) {
            project.content = payload.content
        }
        if (payload.root_folder) {
            project.root_folder = payload.root_folder
        }
        if (payload.github_repo_name) {
            project.github_repo_name = payload.github_repo_name
        }
        if (payload.github_repo_owner) {
            project.github_repo_owner = payload.github_repo_owner
        }
        return Project.update(project, {
            where: {
                id: projectId
            }
        })
    },
    getProjectsOfUser: function(user_id) {
        return User.findById(user_id).then(function(user) {
            return user.getProjects(
            {
                model: Project,
                joinTableAttributes: [],
                include: [{
                    model: User, as:'users',
                    attributes: ['id', 'email', 'display_name', 'display_image']
                }]                                  
            }
            );
        });
    },
    getUsersOfProject: function(project_id) {
        return Project.findById(project_id).then(function(project) {
            return project.getUsers();
        });
    },
    removeUserProject: function(user_id, project_id) {
        return UserProject.destroy({
            where: {
                user_id: user_id,
                project_id: project_id
            }
        });
    },

    getProject: function(id) {
        return Project.findById(id)
    },

    removeProject: function(id) {
        return Project.destroy({
            where: {
                id: id
            }
        });
    },
    createProject: function(content) {
        var id = shortid.generate();
        return Project.create({
            id: id,
            content: content
        });
    },
    removeUser: function(email) {
        return User.destroy({
            where: {
                email: email
            }
        });
    },
    removeUserById: function(id) {
        return User.destroy({
            where: {
                id: id
            }
        });
    },
    updateUser: function(id, data) {
        return User.update(data, {
            where: {
                id: id
            }
        })
    },
    findUser: function(googleId) {
        return User.find({
            where: {
                google_id: googleId
            }
        });
    },
    findUserByEmail: function(email) {
        return User.find({
            where: {
                email: email
            }
        });
    },
    findUserById: function(id) {
        return User.findById(id)
    },    
    addProjectToUser: function(user_id, project) {
        return User.findById(user_id).then(function(user) {
            return user === null ? Promise.reject(new Error('No user found')) :
                user.addProject(project, {role: constants.ROLE_CREATOR});
        });
    },
    doesUserExist: function(email) {
        return User.isExist(email);
    },
    createUser: function(user) {
        user.id = shortid.generate();
        return User.create(user);
    },
    markDone: function(task_id) {
        return Task.update(
            {
                completed_on: new Date().toISOString()
            },
            {
                where: {id: task_id}
            })
    },
    updateTask: function(task, taskId) {
        return Task.update(task, {
            where: {
                id: taskId
            }
        })
    },
    updateMilestone: function(milestone, milestoneId) {
        return Milestone.update(milestone, {
            where: {
                id: milestoneId
            }
        })
    },
    getMilestonesWithCondition: function(condition) {
        return Milestone.findAll({
            where: condition
        })
    },
    getTasksWithCondition: function(condition) {
        return Task.findAll({
            where: condition
        })
    },
    getAllTasks: function() {
        return Task.findAll({});
    },
    getTask: function(task_id) {
        return Task.getTask(task_id);
    },
    getTasksAndMilestones: function(projectId) {
        return Task.findAll({
            where: {
                project_id: projectId
            },
            include: [
                {
                    model: Milestone
                }
            ]
        })
    },
    getMilestone: function(milestone_id) {
        return Milestone.find({where : {id: milestone_id}});
    },
    doesTaskExist: function(task_id) {
        return Task.isExist(task_id);
    },
    doesMilestoneExist: function(milestone_id) {
        return Milestone.isExist(milestone_id);
    },
    createTask: function(task) {
        if ('milestone_id' in task && task.milestone_id !== null) {
            return Milestone.isExist(task.milestone_id).then(function(exists) {
                if (!exists) {
                    return Promise.reject(format(constants.MILESTONE_NOT_EXIST, task.milestone_id));
                }
                task.id = shortid.generate()
                return Task.create(task)
            });

        }
        task.id = shortid.generate()
        return Task.create(task)
    },
    findOrCreateTask: function(task)  {
        return Task.find({
            where: {
                github_id: task.github_id
            }
        }).then(function(t) {
            if (!t) {
                task.id = shortid.generate()
                return Task.create(task)
            }
            return new Promise(function(resolve, reject) {resolve(t)})
        })
    },
    findOrCreateMilestone: function(milestone) {
        return Milestone.find({
            where: {
                github_id: milestone.github_id
            }
        }).then(function(m) {
            if (!m) {
                milestone.id = shortid.generate()
                return Milestone.create(milestone)
            }
            return new Promise(function(resolve, reject) {resolve(m)})
        })
    },
    createMilestone: function(milestone) {
        milestone.id = shortid.generate()
        return Milestone.create(milestone)
    },
    deleteTask: function(task_id) {
        return Task.destroy({
            where: {
                id: task_id
            }
        });
    },
    deleteMilestone: function(milestone_id) {
        return Milestone.destroy({
            where: {
                id: milestone_id
            }
        });
    }
};