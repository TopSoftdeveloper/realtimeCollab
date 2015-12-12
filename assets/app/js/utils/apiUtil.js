let API_BASE_URL = 'http://localhost:4000';
let CREATE_TASK_ENDPOINT = '/tasks';
let COMPLETE_TASK_ENDPOINT = '/mark_completed';
let CREATE_MILESTONE_ENDPOINT = '/milestones';
let CREATE_PROJECT_ENDPOINT = '/projects';
let INVITE_TO_PROJECT_ENDPOINT = '/invite_to_project';
let POPULATE_ENDPOINT = '/user/populate';
let GET_NOTIFICATION_ENDPOINT = '/notifications'

import $ from 'jquery'
import Promise from 'bluebird'

function ajaxPost(endpoint, payload) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

function ajaxGet(endpoint) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        type: 'GET'
    });
}

function ajaxDelete(endpoint, data) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: data,
        type: 'DELETE'
    });
}


export function serverAcceptProject(projectId) {
    return $.ajax({
        url: API_BASE_URL + '/join_project/' + projectId,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        type: 'PUT'
    })
}

export function serverDeleteNotification(id) {
    return ajaxDelete('/notification/' + id)
}

export function serverGetNotifications() {
    return ajaxGet(GET_NOTIFICATION_ENDPOINT)
}

export function serverInviteToProject(payload) {
    return ajaxPost(INVITE_TO_PROJECT_ENDPOINT, payload);
}

export function serverPopulate() {
    return ajaxGet(POPULATE_ENDPOINT + '/' + sessionStorage.getItem('user_id'))
}

export function serverCreateTask(payload) {
    return ajaxPost(CREATE_TASK_ENDPOINT, payload);
}

export function serverCreateMilestone(payload) {
    return ajaxPost(CREATE_MILESTONE_ENDPOINT, payload);
}

export function serverCreateProject(payload) {
    return ajaxPost(CREATE_PROJECT_ENDPOINT, payload);
}

export function serverDeleteTask(task_id, project_id) {
    return ajaxDelete('/task/' + task_id, {project_id: project_id})
}

export function serverMarkDone(task_id, project_id) {
    return ajaxPost(COMPLETE_TASK_ENDPOINT, {task_id: task_id, project_id: project_id})
}