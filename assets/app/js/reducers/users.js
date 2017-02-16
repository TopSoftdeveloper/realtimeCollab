import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
import { filterUnique } from '../utils/general';

// Example state tree:
// [
//     {
//         id: 'EynH-wT-l',
//         email: 'a@a',
//         display_name: 'Yan Yi',
//         display_image: 'url',
//		     online: true,
//         colour: '#FFFFFF'
//     },
//     {
//         id: 'uid2',
//         email: 'b@b',
//         display_name: 'Cristina',
//         display_image: 'url',
//		     online: false,
//         colour: '#FFFFFF'
//     }
// ]
const users = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_USERS:
      return filterUnique(action.users);
    case AppConstants.USER_ONLINE:
      return state.map(user => (
        user.id === action.id ? assign({}, user, { online: true }) : user
      ));
    case AppConstants.USER_OFFLINE:
      return state.map(user => (
        user.id === action.id ? assign({}, user, { online: false }) : user
      ));
    case AppConstants.ADD_USERS:
      const newUsers = filterUnique(action.users);
      const usersToAdd = [];
      for (let i = 0; i < newUsers.length; ++i) {
        const matchingUsers = state.filter(user => user.id === newUsers[i].id);
        if (matchingUsers.length === 0) {
          usersToAdd.push(newUsers[i]);
        }
      }
      return [...state, ...usersToAdd];
    default:
      return state;
  }
};

export default users;
