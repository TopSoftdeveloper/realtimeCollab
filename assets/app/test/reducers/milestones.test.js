import assign from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/milestones.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 'mid1',
    content: 'Do user surveys',
    deadline: null,
    tasks: ['taskid1', 'taskid2'],
    project_id: 'NJ-5My0Jg',
    github_id: null,
    github_number: null,
    created_at: '2017-02-16T14:22:55.000Z',
    updated_at: '2017-02-16T14:23:01.000Z',
    editing: true,
    edited_by: 'NysSbasYe',
  },
  {
    id: 'mid2',
    content: 'complete report',
    deadline: null,
    tasks: ['taskid3', 'taskid1'],
    project_id: 'NJ-5My0Jg',
    github_id: null,
    github_number: null,
    created_at: '2017-02-16T14:22:55.000Z',
    updated_at: '2017-02-16T14:23:01.000Z',
    editing: false,
    edited_by: 'null ',
  },
];
describe('`milestones` reducer', () => {
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
  it('should handle `INIT_MILESTONES`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_MILESTONES,
      milestones: initialState,
    };
    const expected = action.milestones;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `CREATE_MILESTONE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.CREATE_MILESTONE,
      milestone: {
        id: 'mid41',
        content: 'who knows what will happen',
        deadline: '2018-12-16T14:22:55.000Z',
        tasks: [],
        project_id: 'NJ-5My0Jg',
        github_id: null,
        github_number: null,
        created_at: '2017-02-16T14:22:55.000Z',
        updated_at: '2017-02-16T14:23:01.000Z',
        editing: false,
        edited_by: 'LKG$#$',
      },
    };
    const expected = [...[action.milestone], ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_MILESTONE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MILESTONE,
      id: 'mid1',
      milestone: {
        id: 'mid1',
        content: 'Do not do user surveys',
        deadline: null,
        tasks: ['taskid1', 'taskid2'],
        project_id: 'NJ-5My0Jg',
        github_id: null,
        github_number: null,
        created_at: '2017-02-16T14:22:55.000Z',
        updated_at: '2017-02-16T14:23:01.000Z',
        editing: true,
        edited_by: 'NysSbasYe',
      },
    };
    const expected = [action.milestone, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `REPLACE_MILESTONE_ID`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MILESTONE,
      id: 'mid1',
      milestone: {
        id: 'mid4',
        content: 'Do user surveys',
        deadline: null,
        tasks: ['taskid1', 'taskid2'],
        project_id: 'NJ-5My0Jg',
        github_id: null,
        github_number: null,
        created_at: '2017-02-16T14:22:55.000Z',
        updated_at: '2017-02-16T14:23:01.000Z',
        editing: true,
        edited_by: 'NysSbasYe',
      },
    };
    const expected = [action.milestone, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_EDITING` if kind is milestone', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_EDITING,
      kind: 'milestone',
      id: 'mid1',
      user_id: 'sakjh13',
    };
    const edited = assign({}, initialState[0], {
      editing: true,
      edited_by: action.user_id,
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_EDITING` if kind is not milestone', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_EDITING,
      kind: 'task',
      id: 'mid1',
      user_id: 'sakjh13',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_STOP_EDITING` if kind is milestone and user_id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_STOP_EDITING,
      kind: 'milestone',
      id: 'mid1',
      user_id: 'NysSbasYe',
    };
    const edited = assign({}, initialState[0], {
      editing: false,
      edited_by: '',
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_STOP_EDITING` if kind is milestone and user_id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_STOP_EDITING,
      kind: 'milestone',
      id: 'mid1',
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
      id: 'mid1',
      user_id: 'sakjh13',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
