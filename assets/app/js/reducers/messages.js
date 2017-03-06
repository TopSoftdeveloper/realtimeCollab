import * as AppConstants from '../AppConstants';
/*
Example state tree:
const messages = [
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

const messages = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_MESSAGES:
      return [...action.messages];
    case AppConstants.ADD_MESSAGE:
      return [...state, action.message];
    default:
      return state;
  }
};
export default messages;
