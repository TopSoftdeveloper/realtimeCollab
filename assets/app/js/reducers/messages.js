import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const messages = [
  {
    id: '41PYdlLcG',
    content: 'This could be a very very very long comment!',
    author_id: 'EkD69ORwf',
    pinned: true,
    created_at: '2017-03-06T07:01:58.000Z',
    updated_at: '2017-03-06T07:01:58.000Z',
    milestone_id: 'V1BBAPyKz',
    project_id: '4JjOdFAdz'
  },
  {
    id: '41T-d8rcz',
    content: '123',
    author_id: 'EkD69ORwf',
    pinned: false,
    created_at: '2017-03-05T19:37:16.000Z',
    updated_at: '2017-03-05T19:37:16.000Z',
    milestone_id: 'V1BBAPyKz',
    project_id: '4JjOdFAdz'
  },
]
*/

const messages = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_MESSAGES:
      return [...action.messages];
    case AppConstants.ADD_MESSAGE:
      return [...state, action.message];
    case AppConstants.DELETE_MESSAGE:
      return state.filter(message => message.id !== action.id);
    case AppConstants.PIN_MESSAGE:
      return state.map(message => (
        message.id === action.id ? assign({}, message, { pinned: true }) : message
      ));
    case AppConstants.UNPIN_MESSAGE:
      return state.map(message => (
        message.id === action.id ? assign({}, message, { pinned: false }) : message
      ));
    case AppConstants.EDIT_MESSAGE_CONTENT:
      return state.map(message => (
        message.id === action.id ? assign({}, message, { content: action.content }) : message
      ));
    default:
      return state;
  }
};
export default messages;
