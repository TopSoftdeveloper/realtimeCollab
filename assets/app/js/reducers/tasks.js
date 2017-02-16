import assign from 'object-assign';
import * as AppConstants from '../AppConstants';

// Example state tree:
// [
//     {
//         id: 'taskid1',
//         content: 'Create survey',
//         completed_on: null,
//         milestone_id: 'mid1',
//         assignee_id: '',
//         project_id: 'ja0sfd',
//         editing: true,
//         edited_by: 'NysSbasYe'
//         ...
//     }
// ]
const tasks = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_TASKS:
      return action.tasks;

    case AppConstants.DELETE_MILESTONE:
      return state.map(task => (
        task.milestone_id === action.id ? assign({}, task, { milestone_id: null }) : task
      ));

    case AppConstants.MARK_AS_DIRTY:
      return state.map(task => (
        task.id === action.id ? assign({}, task, { dirty: true }) : task
      ));

    case AppConstants.UNMARK_DIRTY:
      return state.map(task => (
        task.id === action.id ? assign({}, task, { dirty: false }) : task
      ));

    case AppConstants.ADD_TASK:
      return [action.task, ...state];

    case AppConstants.DELETE_TASK:
      return state.filter(task => task.id !== action.id);

    case AppConstants.MARK_DONE:
      return state.map(task => (
        task.id === action.id ?
        assign({}, task, { completed_on: new Date().toISOString() }) : task
      ));

    case AppConstants.EDIT_TASK:
      return state.map(task => (
        task.id === action.id ? assign({}, task, action.task) : task
      ));
    case AppConstants.UNMARK_DONE:
      return state.map(task => (
        task.id === action.id ? assign({}, task, { completed_on: null }) : task
      ));

    case AppConstants.REPLACE_TASK_ID:
      return state.map(task => (
        task.id === action.original ? assign({}, task, { id: action.replacement }) : task
      ));

    case AppConstants.USER_EDITING:
      if (action.kind !== 'task') {
        return state;
      }
      return state.map(task => (
        task.id === action.id ? assign({}, task, {
          editing: true, edited_by: action.user_id }) : task
      ));

    case AppConstants.USER_STOP_EDITING:
      if (action.kind !== 'task') {
        return state;
      }
      return state.map(task => (
        task.id === action.id && task.edited_by === action.user_id ?
          assign({}, task, { editing: false, edited_by: '' }) : task
      ));
    default:
      return state;
  }
};

export default tasks;
