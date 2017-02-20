import assign from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/users.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 'uid1',
    email: 'a@a',
    display_name: 'Yan Yi',
    display_image: 'url',
    online: false,
    colour: '#FFFFFF',
  },
  {
    id: 'uid2',
    email: 'b@b',
    display_name: 'Cristina',
    display_image: 'url',
    online: true,
    colour: '#AFFAFF',
  },
];
describe('`users` reducer', () => {
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
  it('should handle `INIT_USERS`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_USERS,
      users: initialState,
    };
    const expected = action.users;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_ONLINE` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_ONLINE,
      id: 'uid1',
    };
    const edited = assign({}, initialState[0], { online: true });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_ONLINE` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_ONLINE,
      id: 'uid134',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_OFFLINE` with id matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_OFFLINE,
      id: 'uid2',
    };
    const edited = assign({}, initialState[1], { online: false });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `USER_OFFLINE` with id mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.USER_OFFLINE,
      id: 'uid11243',
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_USERS` with non duplicate user', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_USERS,
      users: [
        {
          id: 'uid3',
          email: 'C@c',
          display_name: 'lava',
          display_image: 'url',
          online: true,
          colour: '#6F1AF4',
        },
        {
          id: 'uid4',
          email: 'C@c',
          display_name: 'java',
          display_image: 'url',
          online: false,
          colour: '#6F1AF4',
        },
      ],
    };
    const expected = [...initialState, ...action.users];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_USERS` with duplicate user', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_USERS,
      users: [
        {
          id: 'uid3',
          email: 'C@c',
          display_name: 'lava',
          display_image: 'url',
          online: true,
          colour: '#6F1AF4',
        },
        {
          id: 'uid3',
          email: 'C@c',
          display_name: 'java',
          display_image: 'url',
          online: false,
          colour: '#6F1AF4',
        },
      ],
    };
    const expected = [...initialState, action.users[0]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_USERS` with existent user', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_USERS,
      users: [
        {
          id: 'uid1',
          email: 'C@c',
          display_name: 'lava',
          display_image: 'url',
          online: true,
          colour: '#6F1AF4',
        },
        {
          id: 'uid2',
          email: 'C@c',
          display_name: 'java',
          display_image: 'url',
          online: false,
          colour: '#6F1AF4',
        },
      ],
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
