import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// {
//     current_project: 'NJ-5My0Jg',
//     is_linked_to_drive: true,
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
            return assign({}, state, {is_linked_to_drive : true})
        case AppConstants.LOGGED_OUT_GOOGLE:
            return assign({}, state, {is_linked_to_drive : false})
        case AppConstants.QUERY_PROCESSING:
            return assign({}, state, {queriesInProgress: state.queriesInProgress + 1})
        case AppConstants.QUERY_DONE:
            return assign({}, state, {queriesInProgress: state.queriesInProgress - 1})
        default:
            return state
    }
}
