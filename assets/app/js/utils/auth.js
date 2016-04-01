import $ from 'jquery'
let AppConstants = require('../AppConstants');
const CLIENT_ID = '300282221041-etbepkgu5gvfmo7fhd2khp1rv4ktm7b7.apps.googleusercontent.com'
const SCOPES = ['https://www.googleapis.com/auth/drive']
import gapi from '../gapi'

export function logout() {
    localStorage.clear();
    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
}

export function isLoggedIn() {
    return $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + localStorage.google_token
    })
}

export function isLoggedIntoGoogle(callback) {
    var gapiInterval = setInterval(function(){
        if (gapi.auth){
            gapi.auth.authorize(
                {
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': true
                }, callback
            )
            clearInterval(gapiInterval)
        }
    }, 100)
}

export function loginGoogle(callback) {
    var gapiInterval = setInterval(function(){
        if (gapi.auth){
            gapi.auth.authorize(
                {
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': false
                }, callback
            )
            clearInterval(gapiInterval)
        }
    }, 100)
}
