import * as AppConstants from '../AppConstants';
// Example state tree:
// [
//     {
//         id: 'notif-1',
//         text: 'Cristina invited you to the project CS3201',
//         time: new Date().toISOString(),
//         link: 'http://www.nus.edu.sg/',
//         read: false,
//         type: 'INVITE_TO_PROJECT',
//         meta: {meta data here}
//     }
// ]

const notifications = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_NOTIFICATIONS:
      return action.notifications;
    case AppConstants.NEW_NOTIFICATION:
      return [action.notif, ...state];
    case AppConstants.DELETE_NOTIFICATION:
      return state.filter(notif => notif.id !== action.id);
    default:
      return state;
  }
};

export default notifications;
