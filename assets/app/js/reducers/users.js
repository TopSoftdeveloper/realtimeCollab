import * as AppConstants from '../AppConstants';
import assign from 'object-assign';
import {filterUnique} from '../utils/general'

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

export default function users(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_USERS:
            return filterUnique(action.users);
        case AppConstants.USER_ONLINE:
        	return state.map(user =>
        		user.id === action.id ?
        		assign({}, user, {online: true}): user);
        case AppConstants.USER_OFFLINE:
        	return state.map(user =>
        		user.id === action.id ?
        		assign({}, user, {online: false}): user);
        case AppConstants.ADD_USERS:
            let users = filterUnique(action.users)
            let usersToAdd = []
            for (let i=0; i<users.length; ++i) {
                let matchingUsers = state.filter(user => user.id === users[i].id)
                if (matchingUsers.length === 0) {
                    usersToAdd.push(users[i])
                }
            }
            return [...state, ...usersToAdd]
        default:
            return state;
    }
}
