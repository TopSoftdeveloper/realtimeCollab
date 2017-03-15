import $ from 'jquery';

import * as AppConstants from '../AppConstants';
import { dumpList, getLocalUserId } from './general';

const CREATE_TASK_ENDPOINT = '/tasks';
const COMPLETE_TASK_ENDPOINT = '/mark_completed';
const CREATE_MILESTONE_ENDPOINT = '/milestones';
const CREATE_PROJECT_ENDPOINT = '/projects';
const CREATE_MESSAGE_ENDPOINT = '/messages';
const INVITE_TO_PROJECT_ENDPOINT = '/invite_to_project';
const POPULATE_ENDPOINT = '/user/populate';
const GET_NOTIFICATION_ENDPOINT = '/notifications';

const API_BASE_URL = AppConstants.API_BASE_URL;
const googleDriveAPIFiledParams =
'fields=lastModifyingUser%2CmodifiedTime%2CiconLink%2CwebViewLink%2Cparents%2Cname%2Cid%2CmimeType';

/* global localStorage */
/* eslint camelcase: "off" */
export const uploadFile = (multipartRequestBody) => (
  $.ajax(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&${googleDriveAPIFiledParams}`, {
    data: multipartRequestBody,
    type: 'POST',
    processData: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
      'Content-Type': `multipart/mixed; boundary="${AppConstants.MULTIPART_BOUNDARY}"`,
    },
  })
);

export const removeFile = (fileId) => (
  $.ajax(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    type: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
    },
  })
);

export const copyFile = (fileId) => (
  $.ajax(`https://www.googleapis.com/drive/v3/files/${fileId}/copy?${googleDriveAPIFiledParams}`, {
    type: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
    },
  })
);

export const renameFile = (fileId, newName) => (
  $.ajax(`https://www.googleapis.com/drive/v3/files/${fileId}?${googleDriveAPIFiledParams}`, {
    type: 'PATCH',
    processData: false,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
    },
    data: JSON.stringify({ name: newName }),

  })
);

export const createFolder = (multipartRequestBody) => (
  $.ajax(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&${googleDriveAPIFiledParams}`, {
    data: multipartRequestBody,
    type: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
      'Content-Type': `multipart/mixed; boundary="${AppConstants.MULTIPART_BOUNDARY}"`,
    },
  })
);
export const moveFile = (fileId, oldParents, newParents) => (
  $.ajax(`https://www.googleapis.com/drive/v3/files/${fileId}?${googleDriveAPIFiledParams}&addParents=${dumpList(newParents)}&removeParents=${dumpList(oldParents)}`, {
    type: 'PATCH',
    processData: false,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
    },
  })
);
const googleGet = (endpoint, params) => (
  $.ajax({
    url: `https://www.googleapis.com${endpoint}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('google_token')}`,
    },
    type: 'GET',
    data: params,
  })
);


export const queryGoogleDrive = (queryString) => (
  googleGet('/drive/v3/files', {
    pageSize: '20',
    q: `fullText contains '${queryString}'`,
    fields: 'files',
  })
);

export const getGoogleDriveFolders = () => (
  googleGet('/drive/v3/files', {
    pageSize: '100',
    orderBy: 'modifiedTime desc',
    spaces: 'drive',
    q: "mimeType = 'application/vnd.google-apps.folder'",
    fields: 'files',
  })
);

export const getChildrenFiles = (folderId) => (
  googleGet('/drive/v3/files', {
    pageSize: '100',
    orderBy: 'modifiedTime desc',
    q: `'${folderId}' in parents`,
    fields: 'files',
  })
);

export const listRepoEvents = (owner, repo) => (
  $.ajax({
    url: `https://api.github.com/repos/${owner}/${repo}/events`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('github_token')}`,
    },
    type: 'GET',
  })
);

export const queryGithub = (queryString, ownerRepos) => (
  $.ajax({
    url: `https://api.github.com/search/code?q=${queryString}+in:file,path${ownerRepos}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('github_token')}`,
      Accept: 'application/vnd.github.v3.text-match+json',
    },
    type: 'GET',
  })
);

export const getFileInfo = (fileId) => (
  googleGet(`/drive/v3/files/${fileId}`)
);

const ajaxPost = (endpoint, payload) => (
  $.ajax({
    url: API_BASE_URL + endpoint,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    data: payload,
    type: 'POST',
  })
);
const ajaxPut = (endpoint, payload) => (
  $.ajax({
    url: API_BASE_URL + endpoint,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    data: payload,
    type: 'PUT',
  })
);

const ajaxGet = (endpoint) => (
  $.ajax({
    url: API_BASE_URL + endpoint,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    type: 'GET',
  })
);

const ajaxDelete = (endpoint, data) => (
  $.ajax({
    url: API_BASE_URL + endpoint,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    data,
    type: 'DELETE',
  })
);

export const serverDeclineProject = (projectId) => (
  $.ajax({
    url: `${API_BASE_URL}/decline_project/${projectId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    type: 'PUT',
  })
);

export const serverAcceptProject = (projectId) => (
  $.ajax({
    url: `${API_BASE_URL}/join_project/${projectId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    type: 'PUT',
  })
);

export const githubOAuth = (code) => (
  ajaxPost('/github/oauth/access_token', {
    code,
  })
);

export const getGithubRepos = () => (
  $.ajax({
    url: 'https://api.github.com/user/repos?per_page=100',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('github_token')}`,
    },
    type: 'GET',
  })
);

export const syncGithubIssues = (projectId, name, owner) => (
  ajaxPost(`/github/sync/${projectId}`, {
    token: localStorage.getItem('github_token'),
    name,
    owner,
  })
);

export const setupGithubWebhook = (name, owner) => (
  ajaxPost('/webhook/github/setup', {
    token: localStorage.getItem('github_token'),
    name,
    owner,
  })
);

export const serverDeleteNotification = (id) => (
  ajaxDelete(`/notification/${id}`)
);

export const serverGetNotifications = () => (
  ajaxGet(GET_NOTIFICATION_ENDPOINT)
);
export const serverEditNotification = (notification_id, payload) => (
  ajaxPut(`/notification/${notification_id}`, payload)
);

export const serverGetNewesfeed = () => (
  ajaxGet('/newsfeed')
);

export const serverInviteToProject = (payload) => (
  ajaxPost(INVITE_TO_PROJECT_ENDPOINT, payload)
);

export const serverCreatePost = (payload, projectId) => (
  ajaxPost(`/newsfeed/${projectId}`, payload)
);

export const serverUpdateUser = (payload) => (
  ajaxPut(`/user/${getLocalUserId()}`, payload)
);

export const serverUpdateGithubLogin = (token) => (
  ajaxPut(`/user/github/${getLocalUserId()}`, {
    token,
  })
);

export const serverPopulate = () => (
  ajaxGet(`${POPULATE_ENDPOINT}/${getLocalUserId()}`)
);

export const serverCreateTask = (payload) => {
  payload.github_token = localStorage.getItem('github_token');
  return ajaxPost(CREATE_TASK_ENDPOINT, payload);
};


export const serverDeleteTask = (task_id, project_id) => (
  ajaxDelete(`/task/${task_id}`, {
    project_id,
  })
);

export const serverEditTask = (task_id, payload) => {
  payload.github_token = localStorage.getItem('github_token');
  return ajaxPut(`/task/${task_id}`, payload);
};

export const serverCreateMilestone = (payload) => {
  payload.github_token = localStorage.getItem('github_token');
  return ajaxPost(CREATE_MILESTONE_ENDPOINT, payload);
};

export const serverDeleteMilestone = (milestone_id, project_id) => (
  ajaxDelete(`/milestone/${milestone_id}`, {
    project_id,
    github_token: localStorage.getItem('github_token'),
  })
);
export const serverCreateProject = (payload) => (
  ajaxPost(CREATE_PROJECT_ENDPOINT, payload)
);

export const serverUpdateProject = (project_id, payload) => (
  ajaxPut(`/project/${project_id}`, payload)
);

export const serverEditMilestone = (milestone_id, payload) => {
  payload.github_token = localStorage.getItem('github_token');
  return ajaxPut(`/milestone/${milestone_id}`, payload);
};

export const serverMarkDone = (task_id, project_id) => (
  ajaxPost(COMPLETE_TASK_ENDPOINT, {
    task_id,
    project_id,
    github_token: localStorage.getItem('github_token'),
  })
);

export const refreshTokens = () => (
  ajaxPost('/refresh_google_token')
);

export const serverCreateMessage = (payload) => (
  ajaxPost(CREATE_MESSAGE_ENDPOINT, payload)
);
export const serverEditMessage = (messageId, payload) => (
  ajaxPut(`/message/${messageId}`, payload)
);
export const serverDeleteMessage = (messageId) => (
  ajaxDelete(`/message/${messageId}`)
);
