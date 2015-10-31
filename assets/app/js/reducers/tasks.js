import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = [
    {
        id: 'taskid1',
        content: 'Create survey',
        deadline: null,
        completed_on: null,
        is_time_specified: false,
        milestone_id: 'mid1'
    },
    {
        id: 'taskid2',
        content: 'Send to friends',
        deadline: null,
        completed_on: null,
        is_time_specified: false,
        milestone_id: 'mid1'        
    },
    {
        id: 'taskid3',
        content: 'Prepare report',
        deadline: null,
        completed_on: null,
        is_time_specified: false,
        milestone_id: 'mid2'        
    },
    {
        id: 'taskid4',
        content: 'Complete prototype',
        deadline: null,
        completed_on: null,
        is_time_specified: false,
        milestone_id: 'mid3'        
    }                
];

export default function tasks(state=initialState, action) {
    switch (action.type) {
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