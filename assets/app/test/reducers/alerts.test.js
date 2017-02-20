import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/alerts.js';
import * as types from '../../js/AppConstants.js';

describe('`alert` reducer', () => {
  it('should return the initial state', () => {
    const expected = { project_invitation: null };
    expectReducerBehavior(reducer, undefined, {}, expected);
  });
  it('should return current state for Unknown action', () => {
    const stateBefore = {
      project_invitation: 'USER_NOT_FOUND',
    };
    const action = {
      type: 'dummy',
      alert: 'INVITED_TO_PROJECT',
    };
    expectReducerBehavior(reducer, stateBefore, action, stateBefore);
  });
  it('should handle `PROJECT_INVITATION_ALERT`', () => {
    const stateBefore = {
      project_invitation: 'USER_NOT_FOUND',
    };
    const action = {
      type: types.PROJECT_INVITATION_ALERT,
      alert: 'INVITED_TO_PROJECT',
    };
    const expected = { project_invitation: action.alert };
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
