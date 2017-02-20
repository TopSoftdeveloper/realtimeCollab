import * as AppConstants from '../AppConstants';
/*
Example state tree:
const newsfeed = [
  {
    id: 'NkgjBKgCx',
    data: "{\"ref_type\":\"branch\",\"ref\":\"helloworld\",\"user_id\":\"NysSbasYe\"}",
    template: "GITHUB_CREATE",
    created_at: "2016-03-27T08:14:55.000Z",
    updated_at: "2016-03-27T08:14:55.000Z",
    project_id: "4yGslGste",
  },
  {
    id: '4JPGvKe0e',
    data: '{\"user_id\":\"NysSbasYe\",\"commitSize\":2}',
    template: 'GITHUB_PUSH',
    created_at: '2016-03-27T08:21:10.000Z',
    updated_at: '2016-03-27T08:21:10.000Z',
    project_id: 'Ny2XGGjKl',
  }
]
*/

const newsfeed = (state = [], action) => {
  switch (action.type) {
    case AppConstants.ADD_EVENT:
      if (!action.events) {
        return state;
      }
      const eventsToAdd = [];
      // check for duplicates
      for (let i = 0; i < action.events.length; ++i) {
        const matchingEvents = state.filter(event => event.id === action.events[i].id);
        if (matchingEvents.length === 0) {
          eventsToAdd.push(action.events[i]);
        }
      }
      return [...eventsToAdd, ...state];
    default:
      return state;
  }
};
export default newsfeed;
