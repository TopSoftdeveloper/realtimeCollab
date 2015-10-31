import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = {
    current_project: 'NJ-5My0Jg',
};

export default function app(state={}, action) {
    switch (action.type) {
        case AppConstants.INIT_APP:
            return action.app;        
        case AppConstants.SWITCH_TO_PROJECT:
            return assign({}, state, {current_project : action.project_id});
        default:
            return state;
    }
}