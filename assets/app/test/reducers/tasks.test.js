import assign from 'object-assign';
import sinon from 'sinon';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/tasks.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 'taskId1',
    content: 'asfda',
    completed_on: '2017-02-17T10:08:41.000Z',
    github_id: null,
    github_number: null,
    assignee_id: 'EkD69ORwf',
    created_at: '2017-02-17T09:08:41.000Z',
    updated_at: '2017-02-17T09:08:46.000Z',
    milestone_id: null,
    project_id: '4JjOdFAdz',
    dirty: false,
    editing: false,
    edited_by: null,
  },
  {
    id: 'taskId2',
    content: 'gzhenxin',
    completed_on: null,
    github_id: null,
    github_number: null,
    assignee_id: '',
    created_at: '2017-02-12T16:34:04.000Z',
    updated_at: '2017-02-15T17:03:19.000Z',
    milestone_id: null,
    project_id: 'EkTq9OUdG',
    dirty: true,
    editing: true,
    edited_by: 'usr2',
  },
];
describe('`tasks` reducer', () => {
  it('should return the initial state', () => {
    const expected = [];
    expectReducerBehavior(reducer, undefined, [], expected);
  });
  it('should return current state for Unknown action', () => {
    const stateBefore = initialState;
    const action = {
      type: 'dummy',
      value: 1321,
    };
    expectReducerBehavior(reducer, stateBefore, action, stateBefore);
  });
  it('should handle `INIT_TASKS`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_TASKS,
      tasks: initialState,
    };
    const expected = action.tasks;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_MILESTONE` with mielstoneId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_MILESTONE,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_MILESTONE` with mielstoneId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_MILESTONE,
      id: '4JjOdFAdz',
    };
    const edited = assign({}, initialState[0], { milestone_id: null });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `MARK_AS_DIRTY` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.MARK_AS_DIRTY,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `MARK_AS_DIRTY` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.MARK_AS_DIRTY,
      id: 'taskId1',
    };
    const edited = assign({}, initialState[0], { dirty: true });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNMARK_DIRTY` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNMARK_DIRTY,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNMARK_DIRTY` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNMARK_DIRTY,
      id: 'taskId2',
    };
    const edited = assign({}, initialState[1], { dirty: false });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_TASK`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_TASK,
      task: {
        id: '3143sda',
        content: 'Create survey',
        completed_on: null,
        milestone_id: 'mid1',
        assignee_id: '',
        project_id: 'ja0sfd',
        editing: true,
        edited_by: 'NysSbasYe',
      },
    };
    const expected = [action.task, ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_TASK` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_TASK,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_TASK` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_TASK,
      id: 'taskId2',
    };
    const expected = [initialState[0]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `MARK_DONE` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.MARK_DONE,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `MARK_DONE` with id matches', () => {
    const clock = sinon.useFakeTimers();
    const stateBefore = initialState;
    const action = {
      type: types.MARK_DONE,
      id: 'taskId1',
    };
    const edited = assign({}, initialState[0], { completed_on: new Date().toISOString() });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
    clock.restore();
  });
  it('should handle `EDIT_TASK` when id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_TASK,
      id: 'dummy',
      task: {
        content: 'this task has been edited',
      },
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_TASK` when id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_TASK,
      id: 'taskId1',
      task: {
        content: 'this task has been edited',
      },
    };
    const edited = assign({}, initialState[0], action.task);
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNMARK_DONE` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNMARK_DONE,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNMARK_DONE` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNMARK_DONE,
      id: 'taskId2',
    };
    const edited = assign({}, initialState[1], { completed_on: null });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `REPLACE_TASK_ID`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.REPLACE_TASK_ID,
      original: 'taskId1',
      replacement: 'newId',
    };
    const edited = assign({}, initialState[0], { id: action.replacement });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_EDITING` if kind is task', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_EDITING,
      kind: 'task',
      id: 'taskId1',
      user_id: 'usr1',
    };
    const edited = assign({}, initialState[0], {
      editing: true,
      edited_by: action.user_id,
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_EDITING` if kind is not task', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_EDITING,
      kind: 'milestone',
      id: 'mid1',
      user_id: 'usr1',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_STOP_EDITING` if kind is task and user_id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_STOP_EDITING,
      kind: 'task',
      id: 'taskId2',
      user_id: 'usr2',
    };
    const edited = assign({}, initialState[1], {
      editing: false,
      edited_by: '',
    });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_STOP_EDITING` if kind is task and user_id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_STOP_EDITING,
      kind: 'milestone',
      id: 'taskId2',
      user_id: 'Ny1sSbasYe',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_STOP_EDITING` if kind is not milestone', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_STOP_EDITING,
      kind: 'task',
      id: 'taskId2',
      user_id: 'sakjh13',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
