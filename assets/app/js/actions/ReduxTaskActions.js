import {serverCreateTask, serverDeleteTask, serverMarkDone, 
        serverPopulate, serverCreateMilestone, serverCreateProject,
        serverInviteToProject, serverGetNotifications, serverAcceptProject,
        serverDeleteNotification, serverDeleteMilestone, getGoogleDriveFolders,
        getChildrenFiles} from '../utils/apiUtil'
import assign from 'object-assign';
import _ from 'lodash'

let AppConstants = require('../AppConstants');
let ServerConstants = require('../../../../server/constants');

function makeActionCreator(type, ...argNames) {
    return function(...args) {
        let action = { type };
        argNames.forEach((arg, index) => {
          action[argNames[index]] = args[index];
        });
        return action;
    }
}

export const updateAppStatus = makeActionCreator(AppConstants.UPDATE_APP_STATUS, 'app')
export const replaceTaskId = makeActionCreator(AppConstants.REPLACE_TASK_ID, 'original', 'replacement');
export const replaceMilestoneId = makeActionCreator(AppConstants.REPLACE_MILESTONE_ID, 'original', 'replacement');
export const _addTask = makeActionCreator(AppConstants.ADD_TASK, 'task');
export const _deleteTask = makeActionCreator(AppConstants.DELETE_TASK, 'id');
export const markAsDirty = makeActionCreator(AppConstants.MARK_AS_DIRTY, 'id');
export const unmarkDirty = makeActionCreator(AppConstants.UNMARK_DIRTY, 'id');
export const _markDone = makeActionCreator(AppConstants.MARK_DONE, 'id');
export const _unmarkDone = makeActionCreator(AppConstants.UNMARK_DONE, 'id');
export const _createMilestone = makeActionCreator(AppConstants.CREATE_MILESTONE, 'milestone');
export const _deleteMilestone = makeActionCreator(AppConstants.DELETE_MILESTONE, 'id');
export const _createProject = makeActionCreator(AppConstants.CREATE_PROJECT, 'project');
export const _deleteProject = makeActionCreator(AppConstants.DELETE_PROJECT, 'id');
export const replaceProjectId = makeActionCreator(AppConstants.REPLACE_PROJECT_ID, 'original', 'replacement');

export const switchToProject = makeActionCreator(AppConstants.SWITCH_TO_PROJECT, 'project_id');
export const projectAlert = makeActionCreator(AppConstants.PROJECT_INVITATION_ALERT, 'alert');

export const initApp = makeActionCreator(AppConstants.INIT_APP, 'app');
export const initMilestones = makeActionCreator(AppConstants.INIT_MILESTONES, 'milestones');
export const initNotifications = makeActionCreator(AppConstants.INIT_NOTIFICATIONS, 'notifications');
export const initProjects = makeActionCreator(AppConstants.INIT_PROJECTS, 'projects');
export const initTasks = makeActionCreator(AppConstants.INIT_TASKS, 'tasks');
export const initUsers = makeActionCreator(AppConstants.INIT_USERS, 'users');
export const initFiles= makeActionCreator(AppConstants.INIT_FILES, 'files');

export const loggedOutGoogle = makeActionCreator(AppConstants.LOGGED_OUT_GOOGLE);
export const loggedIntoGoogle = makeActionCreator(AppConstants.LOGGED_INTO_GOOGLE);


export const addFile = makeActionCreator(AppConstants.ADD_FILE, 'file');
export const deleteFile = makeActionCreator(AppConstants.DELETE_FILE, 'id');
export const addDirectory = makeActionCreator(AppConstants.ADD_DIRECTORY, 'directory');
export const goToDirectory = makeActionCreator(AppConstants.GO_TO_DIRECTORY, 'id');
export const _setDirectoryAsRoot = makeActionCreator(AppConstants.SET_DIRECTORY_AS_ROOT, 'id');


export const userOnline = makeActionCreator(AppConstants.USER_ONLINE, 'id');
export const userOffline = makeActionCreator(AppConstants.USER_OFFLINE, 'id');

export const newNotification = makeActionCreator(AppConstants.NEW_NOTIFICATION, 'notif');
export const _deleteNotification = makeActionCreator(AppConstants.DELETE_NOTIFICATION, 'id');

export function dismissProjectAlert() {
    return function(dispatch) {
        dispatch(projectAlert(null))
    }
}

export function acceptProject(projectId, notificationId) {
    return function(dispatch) {
        serverAcceptProject(projectId).done(res => {
            serverDeleteNotification(notificationId).done(res => {
                dispatch(_deleteNotification(notificationId))
            }).fail(e => {
                console.log(e)
            })
        }).fail(e => {
            console.log(e)
        })
    }
}

export function initializeApp() {
    return function(dispatch) {
        dispatch(initUsers([{
            id: localStorage.getItem('user_id'),
            email: localStorage.getItem('email'),
            display_name: localStorage.getItem('display_name'),
            online: false
        }]));                

        serverPopulate().done(res => {
            if (res.projects.length > 0) {
                let normalizedTables = normalize(res.projects);
                dispatch(initApp({
                    current_project: normalizedTables.projects[0].id,
                    logged_into_google: false,
                    root_folder: null,
                    directory_structure: []
                }));
                dispatch(initMilestones(normalizedTables.milestones));
                dispatch(initProjects(normalizedTables.projects));
                dispatch(initTasks(normalizedTables.tasks));
                dispatch(initUsers(normalizedTables.users));
            }
        }).fail(e => {
            window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
        });

        serverGetNotifications().done(res => {
            dispatch(initNotifications(res.notifications));
        }).fail(e => {
            console.log(e)
        })
    }
}

export function markDone(id, projectId) {
    return function(dispatch) {
        dispatch(_markDone(id));
        serverMarkDone(id, projectId).done(res => {}).fail(e => {
            console.log(e);
            dispatch(_unmarkDone(id));
        });
    }
}

export function addTask(task) {
	// return a thunk function here
	// thunk function needs to dispatch some actions to change 
  	// the Store status, so give it the "dispatch function"
  	return function(dispatch) {
  		dispatch(_addTask(task));
	    serverCreateTask({
            content: task.content, 
            milestone_id: task.milestone_id, 
            project_id: task.project_id})
        .done(res => {
	        // update the stores with the actual id
	        dispatch(replaceTaskId(task.id, res.id));
	    }).fail(e => {
	        console.log(e);
	       	dispatch(_deleteTask(task.id));
	    });
  	}
}

export function createMilestone(milestone) {
    return function(dispatch) {
        dispatch(_createMilestone(milestone));
        serverCreateMilestone({content:milestone.content, project_id: milestone.project_id})
        .done(res => {
            dispatch(replaceMilestoneId(milestone.id, res.id));
        }).fail(e => {
            console.log(e);
            dispatch(_deleteMilestone(milestone.id));
        });
    }
}

export function deleteMilestone(milestoneId, projectId) {
    return function(dispatch) {
        serverDeleteMilestone(milestoneId, projectId).done(res => {
            dispatch(_deleteMilestone(milestoneId))
        }).fail(e => {
            console.log(e)
        });
    }
}


export function createProject(content) {
    return function(dispatch) {
        serverCreateProject({content:content})
        .done(res => {
            dispatch(_createProject({
                id: res.project_id,
                content: content,
                creator: localStorage.getItem('user_id'),
                basic: [],
                pending: [],
                milestones: []
            }))
        }).fail(e => {
            console.log(e);
        });
    }
}

export function inviteToProject(projectId, email) {
    return function(dispatch) {
        serverInviteToProject({email: email, project_id: projectId})
        .done(res => {
            dispatch(projectAlert(AppConstants.INVITED_TO_PROJECT));
        }).fail(e => {
            if (e.responseJSON.message === ServerConstants.USER_ALREADY_PRESENT) {
                dispatch(projectAlert(AppConstants.USER_ALREADY_EXISTS));
            } else if (e.responseJSON.message === ServerConstants.USER_NOT_FOUND) {
                dispatch(projectAlert(AppConstants.USER_NOT_FOUND));
            } else {
                throw new Error('Unknown error message ' + e.responseJSON.message);
            }
        });
    }
}

export function deleteTask(taskId, projectId) {
	return function(dispatch) {
		dispatch(markAsDirty(taskId));
		serverDeleteTask(taskId, projectId).done(res => {
	        // update the stores with the actual id
	        dispatch(_deleteTask(taskId));
	    }).fail(e => {
	        console.log(e);
	       	dispatch(unmarkDirty(taskId));
	    });
	}
}

function isItemPresent(arr, id) {
    return _.findIndex(arr, function(item) {
        return item.id === id;
    }) >= 0;
}

function normalize(projects) {
    /* 
    * Normalizes nested API response for ease of manipulation in
    * redux state-tree
    */
    let projectState = [];
    let milestoneState = [];
    let taskState = [];
    let userState = [];
    projects.forEach(project => {
        // project table
        let currProj = {
            id: project.id, 
            content: project.content, 
            milestones: [], 
            creator: '', 
            basic: [], 
            pending: []
        };
        currProj.milestones = project.milestones.map(milestone => milestone.id);

        // milestone table
        project.milestones.forEach(milestone => {
            let currMilestone = assign({}, milestone, {tasks: []});
            currMilestone.tasks = milestone.tasks.map(task => task.id);
            currMilestone.project_id = project.id;
            milestoneState.push(currMilestone);

            // task table
            taskState = taskState.concat(milestone.tasks.map(task =>
                assign({}, task, {milestone_id : milestone.id})));
        });

        // fill in user table and update project table
        project.users.forEach(user => {
            if (user.role === 'creator') {
                currProj.creator = user.id;
            } else if (user.role === 'basic') {
                currProj.basic.push(user.id); 
            } else if (user.role === 'pending') {
                currProj.pending.push(user.id);
            } else {
                throw new Error("user has invalid role: " + user.role);
            }
            user.online = false;

            if (!isItemPresent(userState, user.id)) {
                userState.push(user);
            }

        });

        projectState.push(currProj);
    });
    return {
        projects: projectState, 
        milestones: milestoneState,
        tasks:taskState,
        users: userState
    };
}


function getTopLevelFolders(files) {
    let topLevelFolders = []
    files.forEach(file => {
        if (!file.parents) {
            topLevelFolders.push(file)
        }
    })
    return topLevelFolders
}

export function initTopLevelFolders() {
    return function(dispatch) {
        getGoogleDriveFolders().then(res => {
            let topLevelFolders = getTopLevelFolders(res.result.files)
            dispatch(initFiles(topLevelFolders))
            dispatch(updateAppStatus({
                directory_structure: [{id: 'root', name: 'Top level folders'}]
            }))
        }, function (err) {
            console.log(err)
        })
    }
}

export function initChildrenFiles(folderId, folderName) {
    return function(dispatch) {
        getChildrenFiles(folderId).then(res => {
            dispatch(initFiles(res.result.files))
            dispatch(addDirectory({id: folderId, name: folderName}))
        }, function (err) {
            console.log(err)
        })
    }
}

export function initUpperLevelFolder(folderId) {
    return function(dispatch) {
        if (folderId === 'root') {
            dispatch(initTopLevelFolders())
        } else {
            getChildrenFiles(folderId).then(res => {
                dispatch(initFiles(res.result.files))
                dispatch(goToDirectory(folderId))
            }, function (err) {
                console.log(err)
            })
        }
    }
}

export function setDirectoryAsRoot(folderId) {
    return function(dispatch) {
        dispatch(_setDirectoryAsRoot(folderId))
    }
}