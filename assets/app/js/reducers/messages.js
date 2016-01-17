import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'messageid1',
//         content: 'Create survey',
//         deadline: null,
//         completed_on: null,
//         is_time_specified: false,
//         milestone_id: 'mid1'
//     },
//     {
//         id: 'messageid3',
//         content: 'Prepare report',
//         deadline: null,
//         completed_on: null,
//         is_time_specified: false,
//         milestone_id: 'mid2'        
//     }
// ]

var mockMessages = [
    {
        id: 'm_1',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Bill',
        text: 'Hey Jing, want to give a Flux talk at ForwardJS?',
        timestamp: Date.now() - 99999
    },
    {
        id: 'm_2',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Bill',
        text: 'Seems like a pretty cool conference.',
        timestamp: Date.now() - 89999
    },
    {
        id: 'm_3',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Jing',
        text: 'Sounds good.  Will they be serving dessert?',
        timestamp: Date.now() - 79999
    },
    {
        id: 'm_4',
        threadID: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Bill',
        text: 'Hey Dave, want to get a beer after the conference?',
        timestamp: Date.now() - 69999
    },
    {
        id: 'm_5',
        threadID: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Dave',
        text: 'Totally!  Meet you at the hotel bar.',
        timestamp: Date.now() - 59999
    },
    {
        id: 'm_6',
        threadID: 't_3',
        threadName: 'Functional Heads',
        authorName: 'Bill',
        text: 'Hey Brian, are you going to be talking about functional stuff?',
        timestamp: Date.now() - 49999
    },
    {
        id: 'm_7',
        threadID: 't_3',
        threadName: 'Bill and Brian',
        authorName: 'Brian',
        text: 'At ForwardJS?  Yeah, of course.  See you there!',
        timestamp: Date.now() - 39999
    }
]

export default function messages(state=mockMessages, action) {
    switch (action.type) {
        case AppConstants.INIT_MESSAGES:
            return action.messages;

        case AppConstants.ADD_MESSAGE:
            return [...state, action.message];

        case AppConstants.DELETE_MESSAGE:
            return state.filter(message => message.id !== action.id);                 

        case AppConstants.REPLACE_MESSAGE_ID:
            return state.map(message => 
                message.id === action.original ? 
                assign({}, message, {id : action.replacement}): message);
        default:
            return state;
    }
}