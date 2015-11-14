let API_BASE_URL = 'http://localhost:4000';
let MILESTONE_ENDPOINT = '/milestone';
let CREATE_TASK_ENDPOINT = '/create_task';
let DELETE_TASK_ENDPOINT =  '/delete_task';
let COMPLETE_TASK_ENDPOINT = '/mark_completed';
let CREATE_MILESTONE_ENDPOINT = '/create_milestone';
let CREATE_PROJECT_ENDPOINT = '/create_project';
let POPULATE_ENDPOINT = '/user/populate';

import $ from 'jquery'

export function serverPopulate() {
    return $.ajax({
        url: API_BASE_URL + POPULATE_ENDPOINT + '/' + sessionStorage.getItem('user_id'),
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        type: 'GET'
    });
}

export function serverCreateTask(payload) {
    return $.ajax({
        url: API_BASE_URL + CREATE_TASK_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

export function serverCreateMilestone(payload) {
    return $.ajax({
        url: API_BASE_URL + CREATE_MILESTONE_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

export function serverCreateProject(payload) {
    return $.ajax({
        url: API_BASE_URL + CREATE_PROJECT_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

 export function serverDeleteTask(task_id) {
    return $.ajax({
        url: API_BASE_URL + DELETE_TASK_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: {task_id: task_id},
        type: 'DELETE'
    });
}

export function serverMarkDone(task_id) {
    return $.ajax({
        url: API_BASE_URL + COMPLETE_TASK_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: {task_id: task_id},
        type: 'POST'
    });
}