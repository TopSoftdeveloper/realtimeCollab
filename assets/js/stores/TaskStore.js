var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';
var API_BASE_URL = 'http://localhost:4000';
var MILESTONE_ENDPOINT = '/milestone';
var CREATE_TASK_ENDPOINT = '/create_task';
var DELETE_TASK_ENDPOINT =  '/delete_task';
var CREATE_MILESTONE_ENDPOINT = '/create_milestone';

var _ = require('lodash');


var _store = {milestones:[]};

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
        return _store;
    }
});

function modifyArray(modification, task_id, optional_param) {
    var changed = false;
    for (var i = 0; i < _store.milestones.length; ++i) {
        for (var x = 0; x < _store.milestones[i].tasks.length; ++x) {
            var curr_task = _store.milestones[i].tasks[x];
            if (curr_task.id === task_id) {
                modification(_store.milestones[i], x, optional_param);
                changed = true;
                break;
            }
        }
        if (changed) break;
    }
}

function findMilestoneAndModify(modification, milestone_id, optional_param) {
    for (var z = 0; z < _store.milestones.length; ++z) {
        var curr_milestone = _store.milestones[z];
        if (curr_milestone.id === milestone_id) {
            modification(_store, z, optional_param);
            break;
        }
    }
}

function deleteMilestone(_store, pos) {
    _store.milestones.splice(pos, 1);
}

function replaceMilestoneId(_store, pos, replacement) {
    _store.milestones[pos].id = replacement;
}

function addTask(_store, pos, task) {
    var simple_task = {};
    simple_task.id = task.id;
    simple_task.content = task.content;
    simple_task.completed_on = task.completed_on;
    _store.milestones[pos].tasks.push(task);
}

function deleteTask(milestone, pos) {
    milestone.tasks.splice(pos, 1);
}

function markAsDone(milestone, pos) {
    milestone.tasks[pos].completed_on = new Date().toISOString();
}

function replaceTaskId(milestone, pos, replacement) {
    milestone.tasks[pos].id = replacement;
}

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a change
AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.LOAD_TASKS:
            _store = action.milestones;
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.CREATE_MILESTONE:
            var milestones_same_id = _store.milestones.filter(function(milestone) {
                return milestone.id === action.milestone.id;
            });
            if (milestones_same_id.length === 0) {
                _store.milestones.push(action.milestone);
            }
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.DELETE_MILESTONE:
            findMilestoneAndModify(deleteMilestone, action.id);
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.REPLACE_MILESTONE_ID:
            findMilestoneAndModify(replaceMilestoneId, action.original, action.replacement);
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.ADD_TASK:
            findMilestoneAndModify(addTask, action.task.milestone_id, action.task);
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
        case AppConstants.REPLACE_TASK_ID:
            modifyArray(replaceTaskId, action.original, action.replacement);
            TaskStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

module.exports = TaskStore;