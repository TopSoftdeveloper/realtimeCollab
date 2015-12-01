import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'NJ-5My0Jg',
//         content: 'FYP',
//         creator: 'uid1',
//         basic: ['uid2'],
//         pending: ['user_who_was_invited'],
//         milestones: ['mid1', 'mid2']
//     }             
// ]


export default function projects(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_PROJECTS:
            return action.projects;    
        case AppConstants.CREATE_PROJECT:
            return [action.project, ...state];     
        case AppConstants.DELETE_PROJECT:
            return state.filter(project => project.id !== action.id);   
        case AppConstants.REPLACE_PROJECT_ID:
            return state.map(project => 
                project.id === action.original ? 
                assign({}, project, {id : action.replacement}): project);
        default:
            return state;
    }
}