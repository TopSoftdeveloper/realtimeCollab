import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree: 
// {
//     current_project: 'NJ-5My0Jg',
//     logged_into_google: true,
// }

export default function app(state={}, action) {
    switch (action.type) {
        case AppConstants.INIT_APP:
            return action.app
        case AppConstants.UPDATE_APP_STATUS:
            return assign({}, state, action.app)
        case AppConstants.SWITCH_TO_PROJECT:
            return assign({}, state, {current_project : action.project_id})
        case AppConstants.LOGGED_INTO_GOOGLE:
            return assign({}, state, {logged_into_google : true})
        case AppConstants.LOGGED_OUT_GOOGLE:
            return assign({}, state, {logged_into_google : false})
        default:
            return state
    }
}