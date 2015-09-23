var constants = require('../constants');
var shortid = require('shortid');
var Promise = require("bluebird");
var models = require('./models/modelManager');
var Task = models.Task;
var Milestone = models.Milestone;
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

    }
};