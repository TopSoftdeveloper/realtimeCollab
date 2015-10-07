var apiUtil = require('../apiUtils/apiUtil');
var TaskActions = require('../actions/TaskActions');
var MilestoneActions = require('../actions/MilestoneActions');
var ErrorActions = require('../actions/ErrorActions');
var _ = require('lodash');

function _addTask(task) {
    TaskActions.addTask(task);

    var payload = {};
    payload.content = task.content;
    payload.milestone_id = task.milestone_id;
    apiUtil.createTask(payload).done(function(res) {
        // update the stores with the actual id
        TaskActions.replaceTaskId(task.id, res.id);
    }).fail(function(e) {
        console.log(e);
        TaskActions.deleteTask(task.id);
        ErrorActions.addTaskFail(task.id);
    });
}

module.exports = {
    loadTasks: function(project_id) {
        apiUtil.getAllMilestones(project_id).done(function(milestones) {
            TaskActions.loadTasks(milestones);
        }).fail(function(e) {
            console.log('load tasks failed');
            console.log(e);
        });
    },
    addTask: function(task, project_id) {
        // create milestone first if not present
        if (task.milestone_id === null) {
            var temp_milestone_id = _.uniqueId("milestone_id");
            MilestoneActions.createMilestone({
                id: temp_milestone_id,
                content: task.milestone_content,
                deadline: null,
                tasks: [],
                project_id: project_id
            });

            apiUtil.createMilestone({
                content: task.milestone_content,
                project_id: project_id
            }).done(function(res) {
                MilestoneActions.replaceMilestoneId(temp_milestone_id, res.id);
                task.milestone_id = res.id;
                _addTask(task);
            }).fail(function(e) {
                console.log(e);
                MilestoneActions.deleteMilestone(temp_milestone_id);
            });

        } else {
            _addTask(task);
        }
    },
    deleteTask: function(id) {
        TaskActions.markAsDirty(id);

        apiUtil.deleteTask(id).done(function() {
            TaskActions.deleteTask(id);
        }).fail(function(e) {
            console.log(e);
            TaskActions.unmarkDirty(id);
        });
    },
    markDone: function (id) {
        TaskActions.markDone(id);

        apiUtil.markDone(id).fail(function(e) {
            console.log(e);
            TaskActions.unmarkDone(id);
        });
    }
};
