import * as AppConstants from '../AppConstants';
import assign from 'object-assign';
import _ from 'lodash';
// Example state tree:
// [
//     {
//         id: 'NJ-5My0Jg',
//         content: 'FYP',
//         creator: 'uid1',
//         basic: ['uid2'],
//         pending: ['user_who_was_invited'],
//         milestones: ['mid1', 'mid2'],
//         tasks: [],
//         root_folder: folderId,
//         directory_structure: [{name: 'upper level directory', id: 123},
//          {name: 'curr directory', id: 999}],
//         files_loaded: true,
//         github_repo_name : 'repoName',
//         github_repo_owner: 'repoOwner'
//     }
// ]


export default function projects(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_PROJECTS:
            return action.projects
        case AppConstants.CREATE_PROJECT:
            return [action.project, ...state]
        case AppConstants.DELETE_PROJECT:
            return state.filter(project => project.id !== action.id);
        case AppConstants.REPLACE_PROJECT_ID:
            return state.map(project =>
                project.id === action.original ?
                assign({}, project, {id : action.replacement}): project)
        case AppConstants.UPDATE_PROJECT:
            return state.map(project =>
                project.id === action.id ?
                    assign({}, project, action.payload): project)
        case AppConstants.JOIN_PROJECT:
            let p = state.filter(project => project.id === action.id)[0]
            p.pending = p.pending.filter(id => id !== action.user_id)
            p.basic.push(action.user_id)
            return state.map(project =>
                project.id === action.id ?
                    assign({}, project, p): project)
        case AppConstants.ADD_DIRECTORY:
            return state.map(project => {
              // avoid adding duplicate directory
              if (project.id == action.id && (_.findIndex(project.directory_structure, o => {return o.id == action.directory.id})) === -1) {
                return assign({}, project, {
                    directory_structure : [...project.directory_structure, action.directory]
                })
              } else {
                return project
              }
            })
        case AppConstants.GO_TO_DIRECTORY:
            return state.map(project => {
                if (project.id === action.projectId) {
                    let directoryStructure = project.directory_structure
                    let i = directoryStructure.length - 1
                    while(directoryStructure[i].id !== action.dirId && i >= 0) {
                        directoryStructure.pop()
                        i--
                    }
                    return assign({}, project, { directory_structure : directoryStructure })
                } else {
                    return project
                }
            })
        case AppConstants.SET_DIRECTORY_AS_ROOT:
            return state.map(project => {
                if (project.id === action.projectId) {
                    let updatedDirStructure = project.directory_structure.filter(dir => dir.id === action.dirId)
                    return assign({}, project, {
                        root_folder : action.dirId,
                        directory_structure: updatedDirStructure,
                        folder_error: ''
                    })
                } else {
                    return project
                }
            })
        case AppConstants.SET_GITHUB_REPO:
            return state.map(project => {
                if (project.id === action.projectId) {
                    return assign({}, project, {
                        github_repo_name : action.repoName,
                        github_repo_owner: action.repoOwner
                    })
                } else {
                    return project
                }
            })
        default:
            return state;
    }
}
