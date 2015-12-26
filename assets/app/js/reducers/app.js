import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree: 
// {
//     current_project: 'NJ-5My0Jg',
//     logged_into_google: true,
//     root_folder: folderId,
//     directory_structure: [{name: 'upper level directory', id: 123},
//          {name: 'curr directory', id: 999}]
// }

export default function app(state={}, action) {
    switch (action.type) {
        case AppConstants.INIT_APP:
            return action.app
        case AppConstants.UPDATE_APP_STATUS:
            return assign({}, state, action.app)
        case AppConstants.ADD_DIRECTORY:
            return assign({}, state, {
                directory_structure : [...state.directory_structure, action.directory]
            })
        case AppConstants.GO_TO_DIRECTORY:
            let directoryStructure = state.directory_structure
            let i = directoryStructure.length - 1
            while(directoryStructure[i].id !== action.id && i >= 0) {
                directoryStructure.pop()
                i--
            }
            return assign({}, state, { directory_structure : directoryStructure })
        case AppConstants.SET_DIRECTORY_AS_ROOT:
            let updatedDirStructure = state.directory_structure.filter(dir => dir.id === action.id)
            return assign({}, state, {
                root_folder : action.id,
                directory_structure: updatedDirStructure
            })
        case AppConstants.SWITCH_TO_PROJECT:
            return assign({}, state, {current_project : action.project_id})
        case AppConstants.LOGGED_INTO_GOOGLE:
            return assign({}, state, {logged_into_google : true})
        case AppConstants.LOGGED_OUT_GOOGLE:
            return assign({}, state, {logged_into_google : false})
        default:
            return state
    }
}