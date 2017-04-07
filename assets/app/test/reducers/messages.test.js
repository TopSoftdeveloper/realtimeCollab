import assign from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/messages.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: '41-k3ja3M',
    content: 'REOPEN_TASK',
    author_id: null,
    pinned: false,
    content_updated_at: null,
    content_updated_by: null,
    data: '{"user":{"id":"41pEQvo2M","display_name":"JJ Zhang"},"task":{"id":"Nk4u8iTnG",' +
    '"content":"[Refactor] needs to change all \\"\\\\n\\" to System.lineSeparator()"}}',
    created_at: '2017-04-05T09:45:36.000Z',
    updated_at: '2017-04-05T09:45:36.000Z',
    milestone_id: '4kmF4FjnG',
    project_id: '4k_8lUc3M',
  },
  {
    id: '4JeWvYihf',
    content: '### Topic',
    author_id: '41pEQvo2M',
    pinned: true,
    content_updated_at: null,
    content_updated_by: null,
    data: null,
    created_at: '2017-04-03T18:43:43.000Z',
    updated_at: '2017-04-03T18:43:43.000Z',
    milestone_id: 'NJ8r8Kj2z',
    project_id: '4k_8lUc3M',
  },
];
describe('`messages` reducer', () => {
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
  it('should handle `INIT_MESSAGES`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_MESSAGES,
      messages: initialState,
    };
    const expected = action.messages;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_MESSAGE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_MESSAGE,
      message: {
        id: 'newMessageId',
        content: '### Another Topic',
        author_id: '41pEQvo2M',
        pinned: false,
        content_updated_at: null,
        content_updated_by: null,
        data: null,
        created_at: '2017-05-03T18:43:43.000Z',
        updated_at: '2017-05-03T18:43:43.000Z',
        milestone_id: 'NJ8r8Kj2z',
        project_id: '4k_8lUc3M',
      },
    };
    const expected = [...initialState, action.message];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_MESSAGE` with messageId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_MESSAGE,
      id: 'mismatched',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_MESSAGE` with messageId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_MESSAGE,
      id: '4JeWvYihf',
    };
    const expected = [initialState[0]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_MESSAGE` with messageId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MESSAGE,
      id: 'mismatched',
      message: {
        content_updated_at: 'Hu Ge',
      },
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_MESSAGE` with messageId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MESSAGE,
      id: '4JeWvYihf',
      message: {
        content_updated_at: 'Hu Ge',
      },
    };
    const edited = assign({}, initialState[1], action.message);
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `PIN_MESSAGE` with messageId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.PIN_MESSAGE,
      id: 'mismatched',
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `PIN_MESSAGE` with messageId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.PIN_MESSAGE,
      id: '41-k3ja3M',
    };
    const edited = assign({}, initialState[0], { pinned: true });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNPIN_MESSAGE` with messageId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNPIN_MESSAGE,
      id: 'mismatched',
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UNPIN_MESSAGE` with messageId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UNPIN_MESSAGE,
      id: '4JeWvYihf',
    };
    const edited = assign({}, initialState[1], { pinned: false });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_MESSAGE_CONTENT` with messageId mismatches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MESSAGE_CONTENT,
      id: 'mismatched',
      content: 'changed',
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `EDIT_MESSAGE_CONTENT` with messageId matches', () => {
    const stateBefore = initialState;
    const action = {
      type: types.EDIT_MESSAGE_CONTENT,
      id: '4JeWvYihf',
      content: 'changed',
    };
    const edited = assign({}, initialState[1], { content: action.content });
    const expected = [initialState[0], edited];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
