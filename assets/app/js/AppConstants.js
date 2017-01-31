import * as Cookies from "js-cookie";
const base64json = require('base64json');

var config_encoded = Cookies.getJSON('config')
const defaultConfig = {
  "hostname": "http://localhost:8080",
  "app_root_url": "http://localhost:8080/app",
  "api_base_url": "http://localhost:8080",
  "google_client_id": "251991763841-3at7cvsqmra7q78m7ptp5ai89s3doi35.apps.googleusercontent.com",
  "github_client_id": "d530a5d9c552e390d942"
}
const client_config = config_encoded != null ? JSON.parse(base64json.parse(config_encoded)) : defaultConfig;
export const PATH = {
  milestones: 'milestones',
  files: 'files',
  newsfeed: 'newsfeed',
  settings: 'settings'
};
export const MULTIPART_BOUNDARY = '-------314159265358979323846';
export const SNACKBAR_MESSAGE = 'SNACKBAR_MESSAGE';
export const ADD_RESULTS = 'ADD_RESULTS';
export const INIT_RESULTS = 'INIT_RESULTS';
export const INIT_GITHUB_REPOS = 'INIT_GITHUB_REPOS';
export const GITHUB_CLIENT_ID = client_config.github_client_id;
export const GOOGLE_CLIENT_ID = client_config.google_client_id;
export const UPDATE_APP_STATUS = 'UPDATE_APP_STATUS';
export const SET_DIRECTORY_AS_ROOT = 'SET_DIRECTORY_AS_ROOT';
export const SET_GITHUB_REPO = 'SET_GITHUB_REPO';
export const ADD_EVENT = 'ADD_EVENT';
export const UPDATE_PROJECT ='UPDATE_PROJECT';
export const JOIN_PROJECT = 'JOIN_PROJECT';
export const ADD_DIRECTORY = 'ADD_DIRECTORY';
export const GO_TO_DIRECTORY = 'GO_TO_DIRECTORY';
export const LOGGED_INTO_GOOGLE = 'LOGGED_INTO_GOOGLE';
export const LOGGED_OUT_GOOGLE = 'LOGGED_OUT_GOOGLE';
export const UPDATE_FILE = 'UPDATE_FILE';
export const ADD_FILES = 'ADD_FILES';
export const INSERT_FILE = 'INSERT_FILE';
export const DELETE_FILE = 'DELETE_FILE';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const REPLACE_PROJECT_ID = 'REPLACE_PROJECT_ID';
export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';
export const USER_EDITING = 'USER_EDITING';
export const USER_STOP_EDITING = 'USER_STOP_EDITING';
export const ADD_USERS = 'ADD_USERS';
export const ADD_TASK = 'ADD_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const CREATE_MILESTONE = 'CREATE_MILESTONE';
export const DELETE_TASK = 'DELETE_TASK';
export const MARK_AS_DIRTY = 'MARK_AS_DIRTY';
export const UNMARK_DIRTY = 'UNMARK_DIRTY';
export const DELETE_MILESTONE = 'DELETE_MILESTONE';
export const EDIT_MILESTONE = 'EDIT_MILESTONE';
export const MARK_DONE = 'MARK_DONE';
export const UNMARK_DONE = 'UNMARK_DONE';
export const REPLACE_TASK_ID = 'REPLACE_TASK_ID';
export const REPLACE_MILESTONE_ID = 'REPLACE_MILESTONE_ID';
export const ADD_TASK_FAIL = 'ADD_TASK_FAIL';
export const LOAD_TASKS = 'LOAD_TASKS';
export const LOG_OUT = 'LOG_OUT';
export const SWITCH_TO_PROJECT = 'SWITCH_TO_PROJECT';
export const PROJECT_INVITATION_ALERT = 'PROJECT_INVITATION_ALERT';
export const INVITED_TO_PROJECT = 'INVITED_TO_PROJECT';
export const INVITATION_ERROR = 'INVITATION_ERROR';
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
export const INIT_SNACKBAR ='INIT_SNACKBAR';
export const UPDATE_SNACKBAR ='UPDATE_SNACKBAR';
export const INIT_APP = 'INIT_APP';
export const INIT_MILESTONES = 'INIT_MILESTONES';
export const INIT_NOTIFICATIONS = 'INIT_NOTIFICATIONS';
export const INIT_PROJECTS = 'INIT_PROJECTS';
export const INIT_TASKS = 'INIT_TASKS';
export const INIT_USERS = 'INIT_USERS';
export const INIT_FILES = 'INIT_FILES';
export const APP_ROOT_URL = client_config.app_root_url;
export const HOSTNAME = client_config.hostname;
export const API_BASE_URL = client_config.api_base_url;
export const INIT_MESSAGES = 'INIT_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const REPLACE_MESSAGE_ID = 'REPLACE_MESSAGE_ID';
export const QUERY_PROCESSING = 'QUERY_PROCESSING';
export const QUERY_DONE = 'QUERY_DONE';
