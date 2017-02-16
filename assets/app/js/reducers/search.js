import * as AppConstants from '../AppConstants';
// Search results to be displayed in seach box.
// Example state tree:
// [
//     {
//         id: 'adfasfipw',
//         primaryText: 'bar',
//         secondaryText: 'Create survey',
//         link: "www.google.com",
//         thumbnail: ''
//     }
// ]
const search = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_RESULTS:
      return action.results;
    case AppConstants.ADD_RESULTS:
      const resultsToAdd = [];
      // check for duplicates
      for (let i = 0; i < action.results.length; ++i) {
        const matchingResults = state.filter(result => result.id === action.results[i].id);
        if (matchingResults.length === 0) {
          resultsToAdd.push(action.results[i]);
        }
      }
      return [...resultsToAdd, ...state];
    default:
      return state;
  }
};
export default search;
