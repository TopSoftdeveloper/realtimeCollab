import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'taskid1',
//         content: 'Create survey',
//         completed_on: null,
//         milestone_id: 'mid1'
//     },
//     {
//         id: 'taskid3',
//         content: 'Prepare report',
//         completed_on: null,
//         milestone_id: 'mid2'
//     }
// ]

export default function tasks(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_TASKS:
            return action.tasks;
        case AppConstants.DELETE_MILESTONE:
            return state.map(task =>
                task.milestone_id === action.id?
                    assign({}, task, {milestone_id: null}): task);
        case AppConstants.MARK_AS_DIRTY:
            return state.map(task => 
                task.id === action.id? 
                assign({}, task, {dirty: true}): task);

        case AppConstants.UNMARK_DIRTY:
            return state.map(task => 
                task.id === action.id ? 
                assign({}, task, {dirty: false}): task);

        case AppConstants.ADD_TASK:
            return [action.task, ...state];

        case AppConstants.DELETE_TASK:
            return state.filter(task => task.id !== action.id);                 
        
        case AppConstants.MARK_DONE:
            return state.map(task => 
                task.id === action.id ? 
                assign({}, task, {completed_on : new Date().toISOString()}): task);

        case AppConstants.EDIT_TASK:
            return state.map(task =>
                task.id === action.id ?
                    assign({}, task, action.task): task);
        case AppConstants.UNMARK_DONE:
            return state.map(task => 
                task.id === action.id ? 
                assign({}, task, {completed_on : null}): task);

        case AppConstants.REPLACE_TASK_ID:
            return state.map(task => 
                task.id === action.original ? 
                assign({}, task, {id : action.replacement}): task);

        default:
            return state;
    }
}