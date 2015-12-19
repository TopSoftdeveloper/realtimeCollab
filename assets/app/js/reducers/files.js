import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'taskid1',
//         kind: 'Create survey',
//         mimeType: "application/vnd.google-apps.document",
//         name: "USACO Training Gateway"
//     }
// ]

export default function files(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_FILES:
            return action.files

        case AppConstants.ADD_FILE:
            return [action.file, ...state]

        case AppConstants.DELETE_FILE:
            return state.filter(file => file.id !== action.id)

        default:
            return state
    }
}