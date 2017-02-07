import $ from 'jquery'
import * as AppConstants from '../AppConstants';

export function logout() {
    localStorage.clear();
    window.location.assign(AppConstants.HOSTNAME);
}
