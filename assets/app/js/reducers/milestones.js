import AppConstants from '../AppConstants';
import assign from 'object-assign';

// Example state tree: 
// [
//     {
//         id: 'mid1',
//         content: 'Do user surveys',
//         deadline: null,
//         tasks: ['taskid1', 'taskid2'],
//         project_id: 'NJ-5My0Jg',
//         editing: true,
//         edited_by: 'NysSbasYe'
//     }
// ]

export default function milestones(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_MILESTONES:
            return action.milestones;

        case AppConstants.CREATE_MILESTONE:
            return [action.milestone, ...state];

        case AppConstants.EDIT_MILESTONE:
            return state.map(milestone =>
                milestone.id === action.id ?
                    assign({}, milestone, action.milestone): milestone);

        case AppConstants.DELETE_MILESTONE:
            return state.filter(milestone => milestone.id !== action.id);

        case AppConstants.REPLACE_MILESTONE_ID:
            return state.map(milestone => 
                milestone.id === action.original ? 
                assign({}, milestone, {id : action.replacement}): milestone);

        case AppConstants.USER_EDITING:
            if (action.kind !== 'milestone') return state
            return state.map(milestone =>
                milestone.id === action.id ?
                    assign({}, milestone, {editing : true, edited_by: action.user_id}): milestone);

        case AppConstants.USER_STOP_EDITING:
            if (action.kind !== 'milestone') return state
            return state.map(milestone =>
                milestone.id === action.id && milestone.edited_by === action.user_id ?
                    assign({}, milestone, {editing : false, edited_by: ''}): milestone);
        default:
            return state;
    }
}