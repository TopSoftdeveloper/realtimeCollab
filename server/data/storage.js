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

function _create(task) {
    return new Promise(function(resolve, reject) {
        var id = shortid.generate();
        var newTask = {
            id: id,
            content: task.content,
            deadline: task.deadline,
            is_time_specified: task.is_time_specified,
            milestone_id: task.milestone_id,
            completed_on: task.completed_on
        };
        Task.create(newTask).catch(function (error) {
            console.log(error);
            var errorList = error.errors;
            if (errorList === undefined || errorList.length !== 1 ||
                errorList[0].message !== constants.DUPLICATE_PRIMARY_KEY ) {
                reject(error);
            } else {
                _create(task);
            }
        }).then(function() {
            resolve(newTask);
        });
    });
}

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
                attributes: ['id', 'content', 'root_folder'],
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
        var id = shortid.generate();
        user.id = id;
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
    updateTask: function(task_id, completed_on, is_time_specified, deadline, content) {
        var task = {}
        if (completed_on !== null) {
            task.completed_on = completed_on
        }
        if (is_time_specified !== null) {
            task.is_time_specified = is_time_specified
        }
        if (deadline !== null) {
            task.deadline = deadline
        }
        if (content !== null) {
            task.content = content
        }
        return Task.update(
            task,
            {
                where: {id: task_id}
            })
    },
    getMilestonesWithTasks: function(project_id) {
        return Milestone.findAll({
            where: {
                project_id: project_id
            },
            attributes: ['id', 'content', 'deadline'],
            include: [
                {
                    model: Task,
                    attributes: ['id', 'content', 'deadline', 'completed_on',
                        'is_time_specified']
                }             
            ]
        })
    },
    getAllTasks: function() {
        return Task.findAll({});
    },
    getTask: function(task_id) {
        return Task.getTask(task_id);
    },
    getMilestone: function(milestone_id) {
        return Milestone.getMilestone(milestone_id);
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
                return _create(task);
            });

        }
        return _create(task);
    },
    createMilestone: function(milestone) {
        return new Promise(function(resolve, reject) {
            var id = shortid.generate();
            Milestone.create({
                id: id,
                content: milestone.content,
                deadline: milestone.deadline,
                project_id: milestone.project_id
            }).catch(function (error) {
                var errorList = error.errors;
                if (errorList === undefined) {
                    reject(error);
                }
                if (errorList.length === 1 &&
                    errorList[0].message === constants.DUPLICATE_PRIMARY_KEY) {
                    this.createMilestone(milestone);
                } else {
                    reject(error);
                }
            }.bind(this)).then(function() {
                resolve(id);
            });
        }.bind(this));
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