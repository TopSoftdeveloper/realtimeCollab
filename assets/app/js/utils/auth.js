import gapi from '../gapi'
let AppConstants = require('../AppConstants');
const CLIENT_ID = '300282221041-b0p1s05ukuvuun3b8h2tuevppjkmgdrc.apps.googleusercontent.com'
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']

export function getToken() {
    return localStorage.token;
}

export function logout() {
    localStorage.clear();
    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
}

export function isLoggedIn() {
    return !!localStorage.jwt;
}

export function isLoggedIntoGoogle(callback) {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        }, callback
    )
}

export function loginGoogle(callback) {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': false
        }, callback
    )
}
