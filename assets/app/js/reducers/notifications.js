import AppConstants from '../AppConstants';
import assign from 'object-assign';

const initialState = [
    {
        id: 'notif-1',
        text: 'Cristina invited you to the project CS3201',
        time: new Date().toISOString(), 
        link: 'http://www.nus.edu.sg/',
        read: false
    },
    {
        id: 'notif-2',            
        text: 'Ken uploaded a file in CG3002',
        time: new Date().toISOString(), 
        link: 'http://www.nus.edu.sg/',            
        read: false
    }
];

export default function notifications(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_NOTIFICATIONS:
            return action.notifications;                
        default:
            return state;
    }
}