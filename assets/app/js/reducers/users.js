import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'EynH-wT-l',
//         email: 'a@a',
//         display_name: 'Yan Yi',
//         display_image: 'url',
//		     online: true
//     },
//     {
//         id: 'uid2',
//         email: 'b@b',
//         display_name: 'Cristina',
//         display_image: 'url',
//		     online: false
//     }        
// ]

export default function users(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_USERS:
            return action.users;        
        case AppConstants.USER_ONLINE:
        	return state.map(user => 
        		user.id === action.id ? 
        		assign({}, user, {online: true}): user);
        case AppConstants.USER_OFFLINE:
        	return state.map(user => 
        		user.id === action.id ? 
        		assign({}, user, {online: false}): user);
        case AppConstants.ADD_USERS:
            let usersToAdd = []
            for (let i=0; i<action.users.length; ++i) {
                let matchingUsers = state.filter(user => user.id === action.users[i].id)
                if (matchingUsers.length === 0) {
                    usersToAdd.push(action.users[i])
                }
            }
            return [...state, ...usersToAdd]
        default:
            return state;
    }
}