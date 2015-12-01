export function getToken() {
    return localStorage.token;
}

export function logout() {
    sessionStorage.clear();
    window.location.assign('http://localhost:4000');
}

export function isLoggedIn() {
    return !!sessionStorage.jwt;
}