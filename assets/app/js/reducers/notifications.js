import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const notifications = [
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
]
*/

const notifications = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_NOTIFICATIONS:
      return action.notifications;
    case AppConstants.NEW_NOTIFICATION:
      return [action.notif, ...state];
    case AppConstants.DELETE_NOTIFICATION:
      return state.filter(notif => notif.id !== action.id);
    case AppConstants.EDIT_NOTIFICATION:
      return state.map(notif => (
        notif.id === action.id ? assign({}, notif, action.notif) : notif
      ));
    default:
      return state;
  }
};

export default notifications;
