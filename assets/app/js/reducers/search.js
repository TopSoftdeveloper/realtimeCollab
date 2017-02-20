import * as AppConstants from '../AppConstants';
/*
Search results to be displayed in seach box.
Example state tree:
const search =  [
  {
    id: '0B6AfgueBZ9TMTlh1UjJObWo5V1E',
    primaryText: 'BBQ.txt',
    secondaryText: 'JJ Zhang',
    link: 'https://drive.google.com/file/d/0B6AfgueBZ9TMTlh1UjJObWo5V1E/view?usp=drivesdk',
    thumbnail: 'https://ssl.gstatic.com/docs/doclist/images/icon_10_text_list.png',
    modifiedTime: '2017-02-04T08:30:32.100Z',
    type: 'drive'
  }
]
*/
const search = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_RESULTS:
      return action.results;
    case AppConstants.ADD_RESULTS: {
      const resultsToAdd = [];
      // check for duplicates
      for (let i = 0; i < action.results.length; ++i) {
        const matchingResults = state.filter(result => result.id === action.results[i].id);
        if (matchingResults.length === 0) {
          resultsToAdd.push(action.results[i]);
        }
      }
      return [...resultsToAdd, ...state];
    }
    default:
      return state;
  }
};
export default search;
