var constants = require('../constants');
var shortid = require('shortid');
var Promise = require("bluebird");
var models = require('./models/modelManager');
var Task = models.Task;
var Milestone = models.Milestone;
var User = models.User;

var format = require('string-format');

function _create(task) {
    return new Promise(function(resolve, reject) {
        var id = shortid.generate();
        Task.create({
            id: id,
            content: task.content,
            deadline: task.deadline,
            is_time_specified: task.is_time_specified,
            milestone_id: task.milestone_id,
            project_id: task.project_id
        }).catch(function (error) {
            console.log(error);
            var errorList = error.errors;
            if (errorList === undefined || errorList.length !== 1 ||
                errorList[0].message !== constants.DUPLICATE_PRIMARY_KEY ) {
                reject(error);
            } else {
                _create(task);
            }
        }).then(function() {
            resolve(id);
        });
    });
}

module.exports = {
    findUser: function(email) {
        return User.find({
            where: {
                email: email
            }
        });
    },
    doesUserExist: function(email) {
        return User.isExist(email);
    },
    createUser: function(salt, hashed_password, email) {
        var id = shortid.generate();
        return User.create({
            id: id,
            password: hashed_password,
            salt: salt,
            email: email
        });
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
    getMilestonesWithTasks: function() {
        return Milestone.findAll({
            include: [
                {
                    model: Task,
                    attributes: ['id', 'content', 'deadline', 'completed_on',
                        'is_time_specified', 'created_at', 'updated_at']
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
        if (task.milestone_id === null) {
            return _create(task);
        }
        return Milestone.isExist(task.milestone_id).then(function(exists) {
            if (!exists) {
                return Promise.reject(format(constants.MILESTONE_NOT_EXIST, task.milestone_id));
            }
            return _create(task);
        });
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