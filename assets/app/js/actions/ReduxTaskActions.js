import {serverCreateTask, serverDeleteTask, serverMarkDone, 
        serverPopulate, serverCreateMilestone, serverCreateProject,
        serverInviteToProject, serverGetNotifications, serverAcceptProject,
        serverDeleteNotification, serverDeleteMilestone, getGoogleDriveFolders,
        getChildrenFiles, getFileInfo, serverUpdateProject, getGithubRepos,
        getGithubEvents, syncGithubIssues} from '../utils/apiUtil'
import {isObjectPresent} from '../utils/general'
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

/**
 * Reducers listen for action types (the first parameter, referenced through AppConstants)
 * emitted by dispatched actionCreators
 */
export const _updateAppStatus = makeActionCreator(AppConstants.UPDATE_APP_STATUS, 'app')
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
export const _updateProject = makeActionCreator(AppConstants.UPDATE_PROJECT, 'id', 'payload');


export const initApp = makeActionCreator(AppConstants.INIT_APP, 'app');
export const initMilestones = makeActionCreator(AppConstants.INIT_MILESTONES, 'milestones');
export const initNotifications = makeActionCreator(AppConstants.INIT_NOTIFICATIONS, 'notifications');
export const initProjects = makeActionCreator(AppConstants.INIT_PROJECTS, 'projects');
export const initTasks = makeActionCreator(AppConstants.INIT_TASKS, 'tasks');
export const initUsers = makeActionCreator(AppConstants.INIT_USERS, 'users');
export const initFiles= makeActionCreator(AppConstants.INIT_FILES, 'files');
export const initMessages = makeActionCreator(AppConstants.INIT_MESSAGES, 'messages');
export const _initGithubRepos = makeActionCreator(AppConstants.INIT_GITHUB_REPOS, 'repos');
export const _addGithubEvents = makeActionCreator(AppConstants.ADD_GITHUB_EVENTS, 'events');

export const loggedOutGoogle = makeActionCreator(AppConstants.LOGGED_OUT_GOOGLE);
export const loggedIntoGoogle = makeActionCreator(AppConstants.LOGGED_INTO_GOOGLE);

export const addFiles = makeActionCreator(AppConstants.ADD_FILES, 'files');
export const deleteFile = makeActionCreator(AppConstants.DELETE_FILE, 'id');
export const _updateFile = makeActionCreator(AppConstants.UPDATE_FILE, 'id', 'payload');
export const addDirectory = makeActionCreator(AppConstants.ADD_DIRECTORY, 'id', 'directory');
export const goToDirectory = makeActionCreator(AppConstants.GO_TO_DIRECTORY, 'projectId', 'dirId');
export const _setDirectoryAsRoot = makeActionCreator(AppConstants.SET_DIRECTORY_AS_ROOT, 'projectId', 'dirId');

export const _setDefaultGithubRepo = makeActionCreator(AppConstants.SET_GITHUB_REPO, 'projectId', 'repoName', 'repoOwner');

export const addMessage = makeActionCreator(AppConstants.ADD_MESSAGE, 'message')

export const userOnline = makeActionCreator(AppConstants.USER_ONLINE, 'id');
export const userOffline = makeActionCreator(AppConstants.USER_OFFLINE, 'id');
export const addUsers = makeActionCreator(AppConstants.ADD_USERS, 'users');

export const newNotification = makeActionCreator(AppConstants.NEW_NOTIFICATION, 'notif');
export const _deleteNotification = makeActionCreator(AppConstants.DELETE_NOTIFICATION, 'id');


function _getGithubRepos(dispatch) {
    getGithubRepos().done(res => {
        dispatch(_initGithubRepos(res))
    }).fail(e => {
        if (e.statusText === "Unauthorized") {
            dispatch(_updateAppStatus({github_token: ''}))
        } else {
            console.log(e)
        }
    })
}


function _getGithubEvents(dispatch, projectId, owner, name) {
    getGithubEvents(owner, name).done(res => {
        let events = res.map(event => {
            let builtEvent = buildGithubEvent(event)
            builtEvent.project = projectId
            return builtEvent
        })
        dispatch(_addGithubEvents(events))
    }).fail(e => {
        if (e.statusText === "Unauthorized") {
            dispatch(_updateAppStatus({github_token: ''}))
        } else {
            console.log(e)
        }
    })
}

export function initGithubRepos() {
    return function(dispatch) {
        if (!localStorage.getItem('github_token')) {
            setTimeout(function() {
                _getGithubRepos(dispatch)
            }, 5000) // delay in case we are still in the midst of getting token
        } else {
            _getGithubRepos(dispatch)
        }
    }
}

export function updateAppStatus(obj) {
    return function(dispatch) {
        dispatch(_updateAppStatus(obj))
    }
}

export function fetchGithubEvents(projectId, owner, name) {
    return function(dispatch) {
        if (!localStorage.getItem('github_token')) {
            setTimeout(function() {
                _getGithubEvents(dispatch, projectId, owner, name)
            }, 1000) // delay in case we are still in the midst of getting token
        } else {
            _getGithubEvents(dispatch, projectId, owner, name)
        }
    }
}

function buildGithubEvent(event) {
    let ret = {
        id: event.id,
        type: event.type,
        created_at: event.created_at,
        actor: event.actor
    }
    switch(event.type) {
        case 'CreateEvent':
            let ref = event.payload.ref
            if (!ref) ref = ''
            ret.message = event.actor.login + ' has created the ' + event.payload.ref_type + ' ' + ref
            ret.link_to = event.actor.url
            break
        case 'DeleteEvent':
            ret.message = event.actor.login + ' has deleted the ' + event.payload.ref_type + ' ' + event.payload.ref
            ret.link_to = event.actor.url
            break
        case 'IssueCommentEvent':
            ret.message = event.actor.login + ' commented on the issue ' + event.payload.issue.title
            ret.link_to = event.actor.url
            break
        case 'IssuesEvent':
            ret.message = event.actor.login + ' ' + event.payload.action + ' the issue ' + event.payload.issue.title
            ret.link_to = event.actor.url
            break
        case 'MemberEvent':
            ret.message = event.payload.member.login + ' was ' + event.payload.action + ' to the repository ' +
                event.repo.name
            ret.link_to = event.actor.url
            ret.actor = event.payload.member
            break
        case 'PullRequestEvent':
            ret.message = event.payload.pull_request.user.login + ' has ' + event.payload.action + ' the pull request ' +
                event.payload.pull_request.title
            ret.link_to = event.payload.pull_request.url
            break
        case 'PushEvent':
            ret.message = event.actor.login + ' has pushed ' + event.payload.size + ' commits'
            ret.link_to = event.actor.url
            break
        default:
            ret.message = event.type
            ret.link_to = event.actor.url
            break
    }
    return ret
}

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
        dispatch(addUsers([{
            id: localStorage.getItem('user_id'),
            email: localStorage.getItem('email'),
            display_name: localStorage.getItem('display_name'),
            display_image: localStorage.getItem('display_image'),
            online: false
        }]));                

        serverPopulate().done(res => {
            if (res.projects.length > 0) {
                let normalizedTables = normalize(res.projects);
                dispatch(initApp({
                    current_project: normalizedTables.projects[0].id,
                    logged_into_google: false,
                    github_token: localStorage.getItem('github_token'),
                    refresh_github_token: false,
                    github: {
                        loading: false
                    }
                }));
                dispatch(initMilestones(normalizedTables.milestones));
                dispatch(initProjects(normalizedTables.projects));
                dispatch(initTasks(normalizedTables.tasks));
                dispatch(addUsers(normalizedTables.users));

                normalizedTables.projects.forEach(project => {
                    if (project.github_repo_name && project.github_repo_owner) {
                        dispatch(fetchGithubEvents(project.id, project.github_repo_owner, project.github_repo_name))
                    }
                })
            }
        }).fail(e => {
            window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
        });

        serverGetNotifications().done(res => {
            dispatch(addUsers(res.users))
            dispatch(initNotifications(res.notifications));
        }).fail(e => {
            console.log(e)
        })
    }
}

export function initializeFiles(project) {
    return function(dispatch) {
        if (!project.files_loaded) {
            if (!project.root_folder || project.root_folder === 'root') {
                dispatch(initTopLevelFolders(project.id))
            } else {
                dispatch(initChildrenFiles(project.id, project.root_folder))
            }
            dispatch(_updateProject(project.id, {files_loaded: true}))
        }
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
                milestones: [],
                root_folder: null,
                directory_structure: [],
                files_loaded: false
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
            tasks: [],
            creator: '', 
            basic: [], 
            pending: [],
            root_folder: project.root_folder,
            directory_structure: [],
            files_loaded: false,
            github_repo_name: project.github_repo_name,
            github_repo_owner: project.github_repo_owner

        };

        project.milestones.forEach(milestone => {
            milestone.tasks = []
            milestoneState.push(milestone)
        });

        project.tasks.forEach(task => {
            taskState.push(task)
            // append taskid to milestoneState
            milestoneState.map(milestone => {
                if (milestone.id === task.milestone_id) {
                    milestone.tasks.push(task.id)
                }
                return milestone
            })
        });


        currProj.milestones = milestoneState.map(milestone => milestone.id);
        currProj.tasks = taskState.map(task => task.id)

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

export function initTopLevelFolders(projectId) {
    return function(dispatch) {
        getGoogleDriveFolders().then(res => {
            let topLevelFolders = getTopLevelFolders(res.result.files)
            dispatch(addFiles(topLevelFolders))
            dispatch(_updateProject(projectId, {directory_structure: [{name: 'Top level directory', id: 'root'}]}))
        }, function (err) {
            console.log(err)
        })
    }
}

/**
 * Used when user clicks on a sub folder
 */
export function initChildrenFiles(projectId, folderId, folderName) {
    return function(dispatch) {
        getChildrenFiles(folderId).then(res => {
            dispatch(addFiles(res.result.files))
            if (folderName) {
                dispatch(addDirectory(projectId, {id: folderId, name: folderName}))
            } else {
                getFileInfo(folderId).then(res => {
                    dispatch(addDirectory(projectId, {id: folderId, name: res.result.name}))
                })
            }
        }, function (err) {
            console.log(err)
        })
    }
}

/**
 * Used when user navigates to a higher level folder (via breadcrumbs)
 */
export function initUpperLevelFolder(projectId, folderId) {
    return function(dispatch) {
        if (folderId === 'root') {
            dispatch(_updateProject(projectId, {directory_structure: [{name: 'Top level directory', id: 'root'}]}))
        } else {
            dispatch(goToDirectory(projectId, folderId))
        }
    }
}

export function setDirectoryAsRoot(projectId, folderId) {
    return function(dispatch) {
        serverUpdateProject(projectId, {root_folder: folderId}).done(res => {
            dispatch(_setDirectoryAsRoot(projectId, folderId))
        }).fail(e => {
            console.log(e)
        })
    }
}

export function syncWithGithub(projectId, repoName, repoOwner) {
    return function(dispatch) {
        serverUpdateProject(projectId, {github_repo_owner: repoOwner, github_repo_name: repoName}).done(res => {
            dispatch(_setDefaultGithubRepo(projectId, repoName, repoOwner))
            dispatch(_updateAppStatus({
                github: {
                    loading: true
                }
            }))
            syncGithubIssues(projectId, repoName, repoOwner).done(res => {
                serverPopulate().done(res => {
                    if (res.projects.length > 0) {
                        let normalizedTables = normalize(res.projects);
                        dispatch(initMilestones(normalizedTables.milestones));
                        dispatch(initTasks(normalizedTables.tasks));
                    }
                    dispatch(_updateAppStatus({
                        github: {
                            loading: false
                        }
                    }))
                }).fail(e => {
                    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
                });
            })
        }).fail(e => {
            console.log(e)
        })
    }
}

export function sendMessage(text) {
    return function(dispatch) {
        let message =     {
            id: _.uniqueId(),
            threadID: 't_3',
            threadName: 'Bill and Brian',
            authorName: 'Brian',
            text: text,
            timestamp: Date.now() - 39999
        }
        dispatch(addMessage(message))
    }
}