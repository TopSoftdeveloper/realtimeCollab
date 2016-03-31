import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'bar',
//         kind: 'Create survey',
//         mimeType: "application/vnd.google-apps.document",
//         name: "USACO Training Gateway",
//         parents: [parentId],
//     }
// ]

export default function files(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_FILES:
            return action.files
        case AppConstants.UPDATE_FILE:
            return state.map(file =>
                file.id === action.id ?
                    assign({}, file, action.payload): file)
        case AppConstants.ADD_FILES:
            // appends files to back of list
            let filesToAdd = []
            // check for duplicates
            for (let i=0; i<action.files.length; ++i) {
                let matchingFiles = state.filter(file => file.id === action.files[i].id)
                if (matchingFiles.length === 0) {
                    filesToAdd.push(action.files[i])
                }
            }
            return [...state, ...filesToAdd]
        case AppConstants.INSERT_FILE:
            // inserts file at front of list
            return [action.file, ...state]

        case AppConstants.DELETE_FILE:
            return state.filter(file => file.id !== action.id)

        default:
            return state
    }
}