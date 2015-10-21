import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = [
    {
        id: 'uid1',
        email: 'a@a',
        display_name: 'Yan Yi'
    },
    {
        id: 'uid2',
        email: 'b@b',
        display_name: 'Cristina'
    }        
];

export default function users(state=initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}