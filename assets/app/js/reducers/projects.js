import AppConstants from '../AppConstants';
import assign from 'object-assign';

// const initialState = [
//     {
//         id: 'NJ-5My0Jg',
//         content: 'FYP',
//         creator: 'uid1',
//         basic: ['uid2'],
//         milestones: ['mid1', 'mid2']
//     },
//     {
//         id: '4yMtMyCyx',
//         content: 'CS3201',
//         creator: 'uid2',
//         basic: ['uid1'],
//         milestones: ['mid3']
//     }             
// ];


export default function projects(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_PROJECTS:
            return action.projects;        
        default:
            return state;
    }
}