import AppConstants from '../AppConstants';
// Example state tree:
// [
//     {
//         id: '3692526635',
//         type: 'PushEvent',
//         message: "seowyanyi has pushed 5 commits",
//         link_to: "url to link to",
//         actor: {},
//         created_at: '2016-02-26T07:48:01Z',
//         project: 'projectId'
//     }
// ]
export default function alerts(state=[], action) {
    switch (action.type) {
        case AppConstants.ADD_GITHUB_EVENTS:
            let eventsToAdd = []
            // check for duplicates
            for (let i=0; i<action.events.length; ++i) {
                let matchingEvents = state.filter(event => event.id === action.events[i].id)
                if (matchingEvents.length === 0) {
                    eventsToAdd.push(action.events[i])
                }
            }
            return [...state, ...eventsToAdd]
        default:
            return state;
    }
}