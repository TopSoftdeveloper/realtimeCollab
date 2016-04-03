import $ from 'jquery'
let AppConstants = require('../AppConstants');

export function logout() {
    localStorage.clear();
    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
}