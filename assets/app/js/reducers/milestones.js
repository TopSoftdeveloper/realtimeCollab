import AppConstants from '../AppConstants';
import assign from 'object-assign';

// Example state tree: 
// [
//     {
//         id: 'mid1',
//         content: 'Do user surveys',
//         deadline: null,
//         tasks: ['taskid1', 'taskid2'],
//         project_id: 'NJ-5My0Jg'
//     },
//     {
//         id: 'mid2',
//         content: 'Week 7 evaluation',
//         deadline: null,
//         tasks: ['taskid3'],
//         project_id: 'NJ-5My0Jg'
//     },
//     {
//         id: 'mid3',
//         content: 'Final Presentation',
//         deadline: null,
//         tasks: ['taskid4'],
//         project_id: '4yMtMyCyx'
//     }        
// ]

export default function milestones(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_MILESTONES:
            return action.milestones;
        case AppConstants.CREATE_MILESTONE:
            return [action.milestone, ...state];

        case AppConstants.DELETE_MILESTONE:
            return state.filter(milestone => milestone.id !== action.id);
            
        case AppConstants.REPLACE_MILESTONE_ID:
            return state.map(milestone => 
                milestone.id === action.original ? 
                assign({}, milestone, {id : action.replacement}): milestone);

        default:
            return state;
    }
}