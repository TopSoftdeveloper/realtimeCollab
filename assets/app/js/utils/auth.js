let AppConstants = require('../AppConstants');

export function getToken() {
    return localStorage.token;
}

export function logout() {
    sessionStorage.clear();
    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
}

export function isLoggedIn() {
    return !!sessionStorage.jwt;
}