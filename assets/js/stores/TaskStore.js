var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
    taskList: [
        {
            milestone: "Design Architecture",
            taskName: "Think about Api. Draw UML Diagrams",
            dueDate: "1441964516",
            isTimeSpecified: true,
            completedDate: null
        },
        {
            milestone: "Design Architecture",
            taskName: "Submit report",
            dueDate: "1446163200",
            isTimeSpecified: false,
            completedDate: null
        },
        {
            milestone: "Design Architecture",
            taskName: "Draw architecture diagram",
            dueDate: "1442163200",
            isTimeSpecified: true,
            completedDate: "1442163200"
        },
        {
            milestone: "Week 7 Evaluation",
            taskName: "Software Aspect",
            dueDate: "1442163200",
            isTimeSpecified: false,
            completedDate: null
        },
        {
            milestone: "Week 7 Evaluation",
            taskName: "Demo path planning",
            dueDate: null,
            isTimeSpecified: false,
            completedDate: null
        },
        {
            milestone: "Week 7 Evaluation",
            taskName: "Firmware Aspect",
            dueDate: "1442163200",
            isTimeSpecified: true,
            completedDate: "1442163200"
        },
        {
            milestone: "Week 7 Evaluation",
            taskName: "Hardware Aspect",
            dueDate: "1442163200",
            isTimeSpecified: false,
            completedDate: "1442163200"
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
        return _store;
    }

});

function isSameTask(a, b) {
    return (a.milestone === b.milestone &&
    a.taskName === b.taskName &&
    a.dueDate === b.dueDate &&
    a.isTimeSpecified === b.isTimeSpecified &&
    a.completedDate === b.completedDate);
}

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a change
AppDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.ADD_TASK:
            // Add the data defined in the TaskActions
            // which the View will pass as a payload
            _store.taskList.push(action.task);
            TaskStore.emit(CHANGE_EVENT);
            break;

        case AppConstants.DELETE_TASK:
            for (var i = 0; i < _store.taskList.length; ++i) {
                if (isSameTask(_store.taskList[i], action.task)) {
                    _store.taskList.splice(i, 1);
                    break;
                }
            }
            TaskStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.MARK_DONE:
            for (var j = 0; j < _store.taskList.length; ++j) {
                if (isSameTask(_store.taskList[j], action.task)) {
                    _store.taskList[j].completedDate = (new Date().getTime()/1000).toString();
                    break;
                }
            }
            TaskStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

module.exports = TaskStore;
