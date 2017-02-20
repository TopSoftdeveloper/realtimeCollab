import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/notifications.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: '4Jdne0IOf',
    text: 'Ge Hu has joined the project b',
    time: '2017-02-10T15:51:51.000Z',
    read: false,
    link: '',
    type: 'JOINED_PROJECT',
    meta: {
      user_id: 'Nk89qOUdM',
      project_id: 'Vyb7JRXuf',
    },
  },
  {
    id: 'EkN007etf',
    text: 'Ge Hu has declined to join the project safasf',
    time: '2017-02-17T18:23:47.000Z',
    read: false,
    link: '',
    type: 'DECLINED_PROJECT',
    meta: {
      user_id: 'Nk89qOUdM',
      project_id: 'N1nd3Ovdz',
    },
  },
];
describe('`notifications` reducer', () => {
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
  it('should handle `INIT_NOTIFICATIONS`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_NOTIFICATIONS,
      notifications: initialState,
    };
    const expected = action.notifications;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `NEW_NOTIFICATION`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.NEW_NOTIFICATION,
      notif: {
        id: 'V1iMfOJFf',
        text: 'Ge Hu has joined the project abc',
        time: '2017-02-17T04:58:35.000Z',
        read: false,
        link: '',
        type: 'JOINED_PROJECT',
        meta: {
          user_id: 'Nk89qOUdM',
          project_id: 'Nypw1dJtz',
        },
      },
    };
    const expected = [action.notif, ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_NOTIFICATION`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_NOTIFICATION,
      id: '4Jdne0IOf',
    };
    const expected = [initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
