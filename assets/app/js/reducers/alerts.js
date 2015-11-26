import AppConstants from '../AppConstants';
import assign from 'object-assign';

//{
//     project_invitation: 'INVITED_TO_PROJECT/USER_NOT_FOUND/USER_ALREADY_EXISTS'
//}

export default function alerts(state={project_invitation: null}, action) {
    switch (action.type) {
        case AppConstants.PROJECT_INVITATION_ALERT:
            return assign({}, state, {project_invitation : action.alert});        
        default:
            return state;
    }
}