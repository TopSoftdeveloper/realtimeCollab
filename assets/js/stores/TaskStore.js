var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');

var CHANGE_EVENT = 'change';
var API_BASE_URL = 'http://localhost:4000';
var MILESTONE_ENDPOINT = '/milestone';

var _store = {
    "status": "OK",
    "milestones": [
        {
            "id": "4JJxig-yx",
            "content": "Exercise",
            "deadline": null,
            "created_at": "2015-09-27T15:31:26.000Z",
            "updated_at": "2015-09-27T15:31:26.000Z",
            "tasks": [
                {
                    "id": "4yzbsl-Jl",
                    "content": "running",
                    "deadline": null,
                    "is_time_specified": false,
                    "created_at": "2015-09-27T15:31:45.000Z",
                    "updated_at": "2015-09-27T15:31:45.000Z",
                    "completed_on": null
                },
                {
                    "id": "N1dXigbyx",
                    "content": "swimming",
                    "deadline": null,
                    "is_time_specified": false,
                    "created_at": "2015-09-27T15:32:23.000Z",
                    "updated_at": "2015-09-27T15:32:23.000Z",
                    "completed_on": null
                }
            ]
        },
        {
            "id": "E1eEjx-1g",
            "content": "Week 7 eval",
            "deadline": null,
            "created_at": "2015-09-27T15:32:31.000Z",
            "updated_at": "2015-09-27T15:32:31.000Z",
            "tasks": [
                {
                    "id": "41RVjeZ1e",
                    "content": "obstacle avoidance",
                    "deadline": null,
                    "is_time_specified": false,
                    "created_at": "2015-09-27T15:32:45.000Z",
                    "updated_at": "2015-09-27T15:32:45.000Z",
                    "completed_on": null
                },
                {
                    "id": "jf2f",
                    "content": "buy veggies",
                    "deadline": null,
                    "is_time_specified": false,
                    "created_at": "2015-09-27T15:32:45.000Z",
                    "updated_at": "2015-09-27T15:32:45.000Z",
                    "completed_on": "2015-09-27T15:32:45.000Z"
                },
                {
                    "id": "jasdfds2f",
                    "content": "eat a cake",
                    "deadline": null,
                    "is_time_specified": false,
                    "created_at": "2015-09-27T15:32:45.000Z",
                    "updated_at": "2015-09-27T15:32:45.000Z",
                    "completed_on": "2015-09-27T15:32:45.000Z"
                }
            ]
        }
    ]
};

// Public API.
// Defines the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
var TaskStore = ObjectAssign( {}, EventEmitter.prototype, {

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getList: function() {
        return $.get(API_BASE_URL + MILESTONE_ENDPOINT);
    }

});

function modifyArray(modification, task_id) {
    var changed = false;
    for (var i = 0; i < _store.milestones.length; ++i) {
        for (var x = 0; x < _store.milestones[i].tasks.length; ++x) {
            var curr_task = _store.milestones[i].tasks[x];
            if (curr_task.id === task_id) {
                modification(_store.milestones[i], x);
                changed = true;
                break;
            }
        }
        if (changed) break;
    }
}

function deleteTask(milestone, pos) {
    milestone.tasks.splice(pos, 1);
}

function markAsDone(milestone, pos) {
    milestone.tasks[pos].completed_on = new Date().toISOString();
}

var getMilestoneId = (function() {
    var id = 0;
    return function() {
        id++;
        return "milestone_id" + id;
    };
})();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a change
AppDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.ADD_TASK:
            // Add the data defined in the TaskActions
            // which the View will pass as a payload
            var added = false;
            for (var z = 0; z < _store.milestones.length; ++z) {
                var curr_milestone = _store.milestones[z];
                if (curr_milestone.content === action.task.milestone) {
                    delete action.task["milestone"];
                    curr_milestone.tasks.push(action.task);
                    added = true;
                    break;
                }
            }

            if (!added) {
                var milestone_name = action.task.milestone;
                delete action.task["milestone"];
                _store.milestones.push({
                    id: getMilestoneId(), //temp id
                    content: milestone_name,
                    deadline: null,
                    tasks: [action.task]
                });
            }

            TaskStore.emit(CHANGE_EVENT);
            break;

        case AppConstants.DELETE_TASK:
            modifyArray(deleteTask, action.id);
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.MARK_DONE:
            modifyArray(markAsDone, action.id);
            TaskStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

module.exports = TaskStore;