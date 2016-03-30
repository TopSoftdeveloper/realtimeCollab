let API_BASE_URL = 'http://devserver.com:4000';
let CREATE_TASK_ENDPOINT = '/tasks';
let COMPLETE_TASK_ENDPOINT = '/mark_completed';
let CREATE_MILESTONE_ENDPOINT = '/milestones';
let CREATE_PROJECT_ENDPOINT = '/projects';
let INVITE_TO_PROJECT_ENDPOINT = '/invite_to_project';
let POPULATE_ENDPOINT = '/user/populate';
let GET_NOTIFICATION_ENDPOINT = '/notifications'
import gapi from '../gapi'

import $ from 'jquery'
import Promise from 'bluebird'

export function uploadFile(file) {
    return gapi.client.request({
        'path': '/upload/drive/v3/files?uploadType=multipart',
        'method': 'POST',
        'body': file
    })
}

export function queryGoogleDrive(queryString) {
    return gapi.client.request({
        'path': '/drive/v3/files',
        'method': 'GET',
        'params': {
            'pageSize': '20',
            'q': "fullText contains '" + queryString + "'",
            'fields': 'files'
        }
    })
}

export function getGoogleDriveFolders() {
    return gapi.client.request({
        'path': '/drive/v3/files',
        'method': 'GET',
        'params': {
            'pageSize': '100',
            'orderBy': 'modifiedTime desc',
            'spaces': 'drive',
            'q': "mimeType = 'application/vnd.google-apps.folder'",
            'fields': 'files'
        }
    })
}

export function getChildrenFiles(folderId) {
    return gapi.client.request({
        'path': '/drive/v3/files',
        'method': 'GET',
        'params': {
            'pageSize': '100',
            'orderBy': 'modifiedTime desc',
            'q': "'" + folderId + "' in parents",
            'fields': 'files'
        }
    })
}

export function getFileInfo(fileId) {
    return gapi.client.request({
        'path': '/drive/v3/files/' + fileId,
        'method': 'GET'
    })
}

function ajaxPost(endpoint, payload) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

function ajaxPut(endpoint, payload) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: payload,
        type: 'PUT'
    });
}

function ajaxGet(endpoint) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'GET'
    });
}

function ajaxDelete(endpoint, data) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: data,
        type: 'DELETE'
    });
}

export function serverDeclineProject(projectId) {
    return $.ajax({
        url: API_BASE_URL + '/decline_project/' + projectId,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'PUT'
    })
}

export function serverAcceptProject(projectId) {
    return $.ajax({
        url: API_BASE_URL + '/join_project/' + projectId,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'PUT'
    })
}

export function githubOAuth(code) {
    return ajaxPost('/github/oauth/access_token', {code: code})
}

export function getGithubRepos() {
    return $.ajax({
        url: 'https://api.github.com/user/repos',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('github_token')
        },
        type: 'GET'
    })
}

export function syncGithubIssues(projectId, name, owner) {
    return ajaxPost('/github/sync/' + projectId, {
        token: localStorage.getItem('github_token'),
        name: name,
        owner: owner
    })
}

export function serverDeleteNotification(id) {
    return ajaxDelete('/notification/' + id)
}

export function serverGetNotifications() {
    return ajaxGet(GET_NOTIFICATION_ENDPOINT)
}

export function serverGetNewesfeed() {
    return ajaxGet('/newsfeed')
}

export function serverInviteToProject(payload) {
    return ajaxPost(INVITE_TO_PROJECT_ENDPOINT, payload);
}

export function serverUpdateUser(payload) {
    return ajaxPut('/user/' + localStorage.getItem('user_id'), payload)
}

export function serverUpdateGithubLogin(token) {
    return ajaxPut('/user/github/' + localStorage.getItem('user_id'), {token:token})
}

export function serverPopulate() {
    return ajaxGet(POPULATE_ENDPOINT + '/' + localStorage.getItem('user_id'))
}

export function serverCreateTask(payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPost(CREATE_TASK_ENDPOINT, payload);
}

export function serverEditTask(task_id, payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPut('/task/' + task_id, payload);
}

export function serverCreateMilestone(payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPost(CREATE_MILESTONE_ENDPOINT, payload);
}

export function serverDeleteMilestone(milestone_id, project_id) {
    return ajaxDelete('/milestone/' + milestone_id, {
        project_id: project_id,
        github_token: localStorage.getItem('github_token')
    })
}

export function serverCreateProject(payload) {
    return ajaxPost(CREATE_PROJECT_ENDPOINT, payload);
}

export function serverUpdateProject(project_id, payload) {
    return ajaxPut('/project/' + project_id, payload);
}

export function serverEditMilestone(milestone_id, payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPut('/milestone/' + milestone_id, payload);
}

export function serverMarkDone(task_id, project_id) {
    return ajaxPost(COMPLETE_TASK_ENDPOINT, {
        task_id: task_id,
        project_id: project_id,
        github_token: localStorage.getItem('github_token')
    })
}