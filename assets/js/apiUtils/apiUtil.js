var API_BASE_URL = 'http://localhost:4000';
var MILESTONE_ENDPOINT = '/milestone';
var CREATE_TASK_ENDPOINT = '/create_task';
var DELETE_TASK_ENDPOINT =  '/delete_task';
var CREATE_MILESTONE_ENDPOINT = '/create_milestone';
var TaskActions = require('../actions/TaskActions');
var ErrorActions = require('../actions/ErrorActions');

var $ = require('jquery');

module.exports = {
    getAllMilestones: function() {
        return $.get(API_BASE_URL + MILESTONE_ENDPOINT);
    },
    createTask: function(payload) {
        return $.post(API_BASE_URL + CREATE_TASK_ENDPOINT, payload);
    },
    createMilestone: function(payload) {
        return $.post(API_BASE_URL + CREATE_MILESTONE_ENDPOINT, payload);
    },
    deleteTask: function(task_id) {
        return $.ajax({
            url: API_BASE_URL + DELETE_TASK_ENDPOINT,
            data: {task_id: task_id},
            type: 'DELETE'
        });
    }
};