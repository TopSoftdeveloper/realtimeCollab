import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/snackbar.js';
import * as types from '../../js/AppConstants.js';

const initialState = {
  isOpen: false,
  message: '',
  background: '',
};
describe('`snackbar ` reducer', () => {
  it('should return the initial state', () => {
    const expected = {};
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
  it('should handle `INIT_SNACKBAR`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.INIT_SNACKBAR,
      snackbar: {
        isOpen: true,
        message: 'hello',
        background: 'red',
      },
    };
    const expected = action.snackbar;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `SNACKBAR_MESSAGE` with kind is default', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SNACKBAR_MESSAGE,
      kind: 'anything except warning and info',
      message: 'hopefully this test passes',
    };
    const expected = {
      message: action.message,
      background: 'rgba(0, 0, 0, 0.870588)',
      isOpen: true,
    };
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `SNACKBAR_MESSAGE` with kind is warning', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SNACKBAR_MESSAGE,
      kind: 'warning',
      message: 'hopefully this test passes again',
    };
    const expected = {
      message: action.message,
      background: 'rgba(226, 88, 88, 0.870588)',
      isOpen: true,
    };
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `SNACKBAR_MESSAGE` with kind is info', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SNACKBAR_MESSAGE,
      kind: 'info',
      message: 'hopefully this test passes again and again',
    };
    const expected = {
      message: action.message,
      background: 'rgba(57, 144, 208, 0.870588)',
      isOpen: true,
    };
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UPDATE_SNACKBAR`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UPDATE_SNACKBAR,
      snackbar: {
        message: 'this is a special message for my love',
        background: 'rgba(57, 144, 208, 0.870588)',
        isOpen: true,
      },
    };
    const expected = action.snackbar;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
