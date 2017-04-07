import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const messages = [
{
  id: '41-k3ja3M',
  content: 'REOPEN_TASK',
  author_id: null,
  pinned: false,
  content_updated_at: null,
  content_updated_by: null,
  data: '{"user":{"id":"41pEQvo2M","display_name":"JJ Zhang"},"task":{"id":"Nk4u8iTnG",
  "content":"[Refactor] needs to change all \\"\\\\n\\" to System.lineSeparator()"}}',
  created_at: '2017-04-05T09:45:36.000Z',
  updated_at: '2017-04-05T09:45:36.000Z',
  milestone_id: '4kmF4FjnG',
  project_id: '4k_8lUc3M'
},
{
  id: '4JeWvYihf',
  content: '### Topic',
  author_id: '41pEQvo2M',
  pinned: false,
  content_updated_at: null,
  content_updated_by: null,
  data: null,
  created_at: '2017-04-03T18:43:43.000Z',
  updated_at: '2017-04-03T18:43:43.000Z',
  milestone_id: 'NJ8r8Kj2z',
  project_id: '4k_8lUc3M'
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
    case AppConstants.EDIT_MESSAGE:
      return state.map(message => (
        message.id === action.id ? assign({}, message, action.message) : message
      ));
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
