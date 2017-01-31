import * as AppConstants from '../AppConstants';

export default function alerts(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_GITHUB_REPOS:
            return action.repos;
        default:
            return state;
    }
}
