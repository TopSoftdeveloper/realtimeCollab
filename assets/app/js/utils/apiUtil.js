let API_BASE_URL = 'http://localhost:4000';
let CREATE_TASK_ENDPOINT = '/tasks';
let COMPLETE_TASK_ENDPOINT = '/mark_completed';
let CREATE_MILESTONE_ENDPOINT = '/milestones';
let CREATE_PROJECT_ENDPOINT = '/projects';
let INVITE_TO_PROJECT_ENDPOINT = '/invite_to_project';
let POPULATE_ENDPOINT = '/user/populate';

import $ from 'jquery'

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

export function serverInviteToProject(payload) {
    return ajaxPost(INVITE_TO_PROJECT_ENDPOINT, payload);
}

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
    return ajaxPost(CREATE_TASK_ENDPOINT, payload);
}

export function serverCreateMilestone(payload) {
    return ajaxPost(CREATE_MILESTONE_ENDPOINT, payload);
}

export function serverCreateProject(payload) {
    return ajaxPost(CREATE_PROJECT_ENDPOINT, payload);
}

 export function serverDeleteTask(task_id, project_id) {
    return $.ajax({
        url: API_BASE_URL + '/task/' + task_id,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: {project_id: project_id},
        type: 'DELETE'
    });
}

export function serverMarkDone(task_id, project_id) {
    return $.ajax({
        url: API_BASE_URL + COMPLETE_TASK_ENDPOINT,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        data: {task_id: task_id, project_id: project_id},
        type: 'POST'
    });
}