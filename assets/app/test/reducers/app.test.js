import assign from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/app.js';
import * as types from '../../js/AppConstants.js';

const initialState = {
  is_linked_to_drive: true,
  is_top_level_folder_loaded: false,
  github: {
    loading: false,
    repo_fetched: false,
  },
  files: {
    loading: false,
  },
  current_project: 'EkTq9OUdG',
  queriesInProgress: 0,
  loading: true,
  queryString: '',
  searchFilter: 'all',
};
describe('`app` reducer', () => {
  it('should return the initial state', () => {
    const expected = {};
    expectReducerBehavior(reducer, undefined, {}, expected);
  });
  it('should return current state for Unknown action', () => {
    const stateBefore = initialState;
    const action = {
      type: 'dummy',
      app: {},
    };
    expectReducerBehavior(reducer, stateBefore, action, stateBefore);
  });
  it('should handle `INIT_APP`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.INIT_APP,
      app: {
        is_linked_to_drive: false,
      },
    };
    const expected = action.app;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UPDATE_APP_STATUS`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UPDATE_APP_STATUS,
      app: {
        is_linked_to_drive: false,
      },
    };
    const expected = assign({}, stateBefore, action.app);
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `SWITCH_TO_PROJECT`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SWITCH_TO_PROJECT,
      project_id: '#23jg314',
    };
    const expected = assign({}, stateBefore, { current_project: action.project_id });
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `LOGGED_INTO_GOOGLE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.LOGGED_INTO_GOOGLE,
    };
    const expected = assign({}, stateBefore, {
      is_linked_to_drive: true,
    });
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `LOGGED_OUT_GOOGLE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.LOGGED_OUT_GOOGLE,
    };
    const expected = assign({}, stateBefore, {
      is_linked_to_drive: false,
    });
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `QUERY_PROCESSING`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.QUERY_PROCESSING,
    };
    const expected = assign({}, stateBefore, {
      queriesInProgress: stateBefore.queriesInProgress + 1,
    });
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `QUERY_DONE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.QUERY_DONE,
    };
    const expected = assign({}, stateBefore, {
      queriesInProgress: stateBefore.queriesInProgress - 1,
    });
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
