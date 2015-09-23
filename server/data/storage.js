var models = require('./models/modelManager');
var Task = models.Task;
var constants = require('../constants');
var shortid = require('shortid');
var Promise = require("bluebird");

module.exports = {
    createTask: function(task) {
        return new Promise(function(resolve, reject) {
            var id = shortid.generate();
            Task.create({
                id: id,
                content: task.content,
                deadline: task.deadline,
                is_time_specified: task.is_time_specified,
                milestone_id: task.milestone_id
            }).catch(function (error) {
                var errorList = error.errors;
                if (errorList.length === 1 &&
                    errorList[0].message === constants.DUPLICATE_PRIMARY_KEY) {
                    this.createTask(task);
                } else {
                    reject(error);
                }
            }.bind(this)).then(function() {
                resolve(id);
            });
        }.bind(this));
    }
};