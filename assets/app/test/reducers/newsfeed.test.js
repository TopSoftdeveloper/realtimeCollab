import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/newsfeed.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 'VyU31mgFG',
    data: '{"user_id":"EkD69ORwf","fileName":"b.txt"}',
    template: 'DRIVE_UPLOAD',
    source: 'GOOGLE_DRIVE',
    created_at: '2017-02-17T17:19:18.000Z',
    updated_at: '2017-02-17T17:19:18.000Z',
    project_id: 'EkTq9OUdG',
  },
  {
    id: 'NkgjBKgCx',
    data: {
      ref_type: 'branch',
      ref: 'helloworld',
      user_id: 'NysSbasYe',
    },
    template: 'GITHUB_CREATE',
    created_at: '2016-03-27T08:14:55.000Z',
    updated_at: '2016-03-27T08:14:55.000Z',
    project_id: '4yGslGste',
  },
];
describe('`newsfeed` reducer', () => {
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
  it('should handle `ADD_EVENT` without duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_EVENT,
      events: [
        {
          id: 'EkjDVflKM',
          data: '{"user_id":"EkD69ORwf","fileName":"b.txt"}',
          template: 'DRIVE_UPLOAD',
          source: 'GOOGLE_DRIVE',
          created_at: '2017-02-17T16:31:06.000Z',
          updated_at: '2017-02-17T16:31:06.000Z',
          project_id: 'EkTq9OUdG',
        },
        {
          id: 'NJb84GxtG',
          data: '{"user_id":"EkD69ORwf","fileName":"a.txt"}',
          template: 'DRIVE_UPLOAD',
          source: 'GOOGLE_DRIVE',
          created_at: '2017-02-17T16:30:40.000Z',
          updated_at: '2017-02-17T16:30:40.000Z',
          project_id: 'EkTq9OUdG',
        },
      ],
    };
    const expected = [...action.events, ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_EVENT` with duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_EVENT,
      events: initialState,
    };
    const expected = action.events;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
