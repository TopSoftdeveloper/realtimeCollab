import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = [
    {
        id: 'EynH-wT-l',
        email: 'a@a',
        display_name: 'Yan Yi'
    },
    {
        id: 'uid2',
        email: 'b@b',
        display_name: 'Cristina'
    }        
];

export default function users(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_USERS:
            return action.users;        
        default:
            return state;
    }
}