import * as AppConstants from '../AppConstants';
import assign from 'object-assign';
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

export default function search(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_RESULTS:
            return action.results
        case AppConstants.ADD_RESULTS:
            let resultsToAdd = []
            // check for duplicates
            for (let i=0; i<action.results.length; ++i) {
                let matchingResults = state.filter(result => result.id === action.results[i].id)
                if (matchingResults.length === 0) {
                    resultsToAdd.push(action.results[i])
                }
            }
            return [...resultsToAdd, ...state]
        default:
            return state
    }
}
