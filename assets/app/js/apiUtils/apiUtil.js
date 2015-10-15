var API_BASE_URL = 'http://localhost:4000';
var MILESTONE_ENDPOINT = '/milestone';
var CREATE_TASK_ENDPOINT = '/create_task';
var DELETE_TASK_ENDPOINT =  '/delete_task';
var COMPLETE_TASK_ENDPOINT = '/mark_completed';
var CREATE_MILESTONE_ENDPOINT = '/create_milestone';
var PROJECT_ENDPOINT = '/project';

var UserStore = require('./UserStore');
var $ = require('jquery');

module.exports = {
    getAllProjects: function(user_id) {
        return $.ajax({
            url: API_BASE_URL + PROJECT_ENDPOINT + '/' + user_id,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            type: 'GET'
        });
    },
    getAllMilestones: function(project_id) {
        return $.ajax({
            url: API_BASE_URL + MILESTONE_ENDPOINT + '/' + project_id,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            type: 'GET'
        });
    },
    createTask: function(payload) {
        return $.ajax({
            url: API_BASE_URL + CREATE_TASK_ENDPOINT,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            data: payload,
            type: 'POST'
        });
    },
    createMilestone: function(payload) {
        return $.ajax({
            url: API_BASE_URL + CREATE_MILESTONE_ENDPOINT,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            data: payload,
            type: 'POST'
        });
    },
    deleteTask: function(task_id) {
        return $.ajax({
            url: API_BASE_URL + DELETE_TASK_ENDPOINT,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            data: {task_id: task_id},
            type: 'DELETE'
        });
    },
    markDone: function(task_id) {
        return $.ajax({
            url: API_BASE_URL + COMPLETE_TASK_ENDPOINT,
            headers: {
                'Authorization': 'Bearer ' + UserStore.getJwt()
            },
            data: {task_id: task_id},
            type: 'POST'
        });
    }
};