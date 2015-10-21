import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = {
    current_user: 'uid1',
    current_project: 'NJ-5My0Jg',
    jwt: 'f02fs'
};

export default function app(state=initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}