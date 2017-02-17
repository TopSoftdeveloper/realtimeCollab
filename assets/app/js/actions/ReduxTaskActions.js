import assign from 'object-assign';
import _ from 'lodash';
import Fuse from 'fuse.js';
import Promise from 'bluebird';

import { serverCreateTask, serverDeleteTask, serverUpdateGithubLogin, serverMarkDone,
  serverPopulate, serverCreateMilestone, serverCreateProject, serverCreatePost,
  serverInviteToProject, serverGetNotifications, serverAcceptProject,
  serverDeleteNotification, serverDeleteMilestone, getGoogleDriveFolders,
  getChildrenFiles, getFileInfo, serverUpdateProject, getGithubRepos,
  syncGithubIssues, serverEditTask, serverEditMilestone, queryGithub, setupGithubWebhook,
  queryGoogleDrive, serverDeclineProject, uploadFile, removeFile, renameFile, copyFile,
  createFolder, moveFile,
  serverGetNewesfeed, refreshTokens, listRepoEvents,
} from '../utils/apiUtil';
import { isObjectPresent, filterUnique, getCurrentProject, getNewColour } from '../utils/general';
import { userIsOnline } from './SocketActions';
import { logout } from '../utils/auth';
import * as AppConstants from '../AppConstants';

const ServerConstants = require('../../../../server/constants');
const templates = require('../../../../server/templates');

const makeActionCreator = (type, ...argNames) => (
  (...args) => {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  }
);


/* eslint no-underscore-dangle: "off" */
/* global localStorage FileReader*/
/**
* Reducers listen for action types (the first parameter, referenced through AppConstants)
* emitted by dispatched actionCreators. Note: the first parameter of the action creator is already
* named "type". So DO NOT name other parameters as "type".
*/
export const _updateAppStatus = makeActionCreator(AppConstants.UPDATE_APP_STATUS, 'app');
export const snackbarMessage = makeActionCreator(AppConstants.SNACKBAR_MESSAGE, 'message', 'kind');
export const updateSnackbar = makeActionCreator(AppConstants.UPDATE_SNACKBAR, 'snackbar');
export const replaceTaskId = makeActionCreator(AppConstants.REPLACE_TASK_ID, 'original',
  'replacement');
export const replaceMilestoneId = makeActionCreator(AppConstants.REPLACE_MILESTONE_ID,
  'original', 'replacement');
export const _addTask = makeActionCreator(AppConstants.ADD_TASK, 'task');
export const _editTask = makeActionCreator(AppConstants.EDIT_TASK, 'id', 'task');
export const _deleteTask = makeActionCreator(AppConstants.DELETE_TASK, 'id');
export const markAsDirty = makeActionCreator(AppConstants.MARK_AS_DIRTY, 'id');
export const unmarkDirty = makeActionCreator(AppConstants.UNMARK_DIRTY, 'id');
export const _markDone = makeActionCreator(AppConstants.MARK_DONE, 'id');
export const _unmarkDone = makeActionCreator(AppConstants.UNMARK_DONE, 'id');
export const _createMilestone = makeActionCreator(AppConstants.CREATE_MILESTONE, 'milestone');
export const _deleteMilestone = makeActionCreator(AppConstants.DELETE_MILESTONE, 'id');
export const _editMilestone = makeActionCreator(AppConstants.EDIT_MILESTONE, 'id', 'milestone');

export const _createProject = makeActionCreator(AppConstants.CREATE_PROJECT, 'project');
export const _deleteProject = makeActionCreator(AppConstants.DELETE_PROJECT, 'id');
export const replaceProjectId = makeActionCreator(AppConstants.REPLACE_PROJECT_ID, 'original',
  'replacement');
export const _switchToProject = makeActionCreator(AppConstants.SWITCH_TO_PROJECT, 'project_id');
export const projectAlert = makeActionCreator(AppConstants.PROJECT_INVITATION_ALERT, 'alert');
export const _updateProject = makeActionCreator(AppConstants.UPDATE_PROJECT, 'id', 'payload');
export const joinProject = makeActionCreator(AppConstants.JOIN_PROJECT, 'id', 'user_id');

export const initSearchResults = makeActionCreator(AppConstants.INIT_RESULTS, 'results');
export const addSearchResults = makeActionCreator(AppConstants.ADD_RESULTS, 'results');
export const queryProcessing = makeActionCreator(AppConstants.QUERY_PROCESSING);
export const queryDone = makeActionCreator(AppConstants.QUERY_DONE);

export const initSnackbar = makeActionCreator(AppConstants.INIT_SNACKBAR, 'snackbar');
export const initApp = makeActionCreator(AppConstants.INIT_APP, 'app');
export const initMilestones = makeActionCreator(AppConstants.INIT_MILESTONES, 'milestones');
export const initNotifications = makeActionCreator(AppConstants.INIT_NOTIFICATIONS,
  'notifications');
export const initProjects = makeActionCreator(AppConstants.INIT_PROJECTS, 'projects');
export const initTasks = makeActionCreator(AppConstants.INIT_TASKS, 'tasks');
export const initUsers = makeActionCreator(AppConstants.INIT_USERS, 'users');
export const initFiles = makeActionCreator(AppConstants.INIT_FILES, 'files');
export const initMessages = makeActionCreator(AppConstants.INIT_MESSAGES, 'messages');
export const _initGithubRepos = makeActionCreator(AppConstants.INIT_GITHUB_REPOS, 'repos');

export const addNewsfeedEvents = makeActionCreator(AppConstants.ADD_EVENT, 'events');

export const loggedOutGoogle = makeActionCreator(AppConstants.LOGGED_OUT_GOOGLE);
export const loggedIntoGoogle = makeActionCreator(AppConstants.LOGGED_INTO_GOOGLE);

export const insertFile = makeActionCreator(AppConstants.INSERT_FILE, 'file');
export const addFiles = makeActionCreator(AppConstants.ADD_FILES, 'files');
export const deleteFile = makeActionCreator(AppConstants.DELETE_FILE, 'id');
export const updateFile = makeActionCreator(AppConstants.UPDATE_FILE, 'id', 'payload');
export const addDirectory = makeActionCreator(AppConstants.ADD_DIRECTORY, 'id', 'directory');
export const goToDirectory = makeActionCreator(AppConstants.GO_TO_DIRECTORY, 'projectId', 'dirId');
export const _setDirectoryAsRoot = makeActionCreator(AppConstants.SET_DIRECTORY_AS_ROOT,
  'projectId', 'dirId');
export const _setDefaultGithubRepo = makeActionCreator(AppConstants.SET_GITHUB_REPO, 'projectId',
  'repoName', 'repoOwner');
export const addMessage = makeActionCreator(AppConstants.ADD_MESSAGE, 'message');
export const userOnline = makeActionCreator(AppConstants.USER_ONLINE, 'id');
export const userOffline = makeActionCreator(AppConstants.USER_OFFLINE, 'id');
export const addUsers = makeActionCreator(AppConstants.ADD_USERS, 'users');
export const userEditing = makeActionCreator(AppConstants.USER_EDITING, 'kind', 'id', 'user_id');
export const userStopEditing = makeActionCreator(AppConstants.USER_STOP_EDITING, 'kind',
  'id', 'user_id');
export const newNotification = makeActionCreator(AppConstants.NEW_NOTIFICATION, 'notif');
export const _deleteNotification = makeActionCreator(AppConstants.DELETE_NOTIFICATION, 'id');

export const addUser = (user) => (
  (dispatch, getState) => {
    const copy = assign({}, user);
    copy.colour = getNewColour(getState().users.map(k => k.colour));
    dispatch(addUsers([copy]));
  }
);

export const moveFileToDrive = (fileId, oldParents, newParents) => (
  (dispatch) => {
    moveFile(fileId, oldParents, newParents).then(
      (newFile) => {
        dispatch(deleteFile(fileId));
        dispatch(insertFile(newFile));
        dispatch(snackbarMessage(`${newFile.name} moved successfully`, 'default'));
      }, (err) => { console.log(err); }
    );
  }
);
export const createFolderToDrive = (directory) => (
  (dispatch) => {
    const boundary = AppConstants.MULTIPART_BOUNDARY;
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const contentType = 'application/vnd.google-apps.folder';
    const metadata = {
      name: 'New Folder',
      mimeType: contentType,
    };
    metadata.parents = [directory];
    const multipartRequestBody = `${delimiter}Content-Type:application/json\r\n\r\n\
${JSON.stringify(metadata)}${delimiter}Content-Type:${contentType}\r\n\
Content-Transfer-Encoding: base64\r\n\r\n${closeDelimiter}`;
    createFolder(multipartRequestBody).then(
      (newFile) => {
        dispatch(insertFile(newFile));
        dispatch(snackbarMessage(`${newFile.name} created successfully`, 'default'));
      }, (err) => { console.log(err); }
    );
  }
);
export const renameFileToDrive = (fileId, newName) => (
  (dispatch) => {
    renameFile(fileId, newName).then(
      (newFile) => {
        dispatch(deleteFile(fileId));
        dispatch(insertFile(newFile));
        dispatch(snackbarMessage(`${newFile.name} renamed successfully`, 'default'));
      }, (err) => { console.log(err); }
    );
  }
);

export const copyFileToDrive = (fileId) => (
  (dispatch) => {
    copyFile(fileId).then(
      (newFile) => {
        dispatch(insertFile(newFile));
        dispatch(snackbarMessage(`${newFile.name} copied successfully`, 'default'));
      }, (err) => { console.log(err); }
    );
  }
);
export const removeFileFromDrive = (fileId) => (
  (dispatch) => {
    removeFile(fileId).then(
      () => {
        dispatch(deleteFile(fileId));
        dispatch(snackbarMessage('File deleted successfully', 'default'));
      }, (err) => { console.log(err); }
    );
  }
);

export const uploadFileToDrive = (file, directory, projectId) => (
  (dispatch) => {
    const fileData = file.data;
    const boundary = AppConstants.MULTIPART_BOUNDARY;
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = () => {
      const contentType = fileData.type || 'application/octect-stream';
      const metadata = {
        name: file.name,
        mimeType: contentType,
      };
      metadata.parents = [directory];

      const base64Data = (reader.result).split(',')[1];
      const multipartRequestBody = `${delimiter}Content-Type:\
application/json\r\n\r\n${JSON.stringify(metadata)}${delimiter}Content-Type:${contentType}\r\n\
Content-Transfer-Encoding:base64\r\n\r\n${base64Data}${closeDelimiter}`;

      uploadFile(multipartRequestBody).then(newFile => {
        dispatch(deleteFile(file.id));
        dispatch(insertFile(newFile));
        dispatch(snackbarMessage(`${newFile.name} uploaded successfully`, 'default'));
        const payload = {
          user_id: localStorage.getItem('user_id'),
          fileName: file.name,
        };
        serverCreatePost({
          template: templates.DRIVE_UPLOAD,
          data: JSON.stringify(payload),
          source: ServerConstants.GOOGLE_DRIVE,
        }, projectId);
      }, (err) => { console.log(err); });
    };
  }
);
export const updateGithubLogin = (token) => (
  (dispatch) => {
    serverUpdateGithubLogin(token);
  }
);

  function testGithubRepos(projects) {
    // Tests whether user can successfully call a repo's API
    // So we can tell whether a repo has been removed, or there's
    // something wrong with the authentication
    return function(dispatch) {
      projects.forEach(project => {
        if (project.github_repo_owner && project.github_repo_name) {
          listRepoEvents(project.github_repo_owner, project.github_repo_name).done(res => {
          }).fail(e => {
            let errorMsg = project.github_repo_owner + '/' + project.github_repo_name + ' is ' + e.responseJSON.message
            dispatch(snackbarMessage(errorMsg, 'warning'))
            dispatch(_updateProject(project.id, {
              github_error: errorMsg
            }))
          })
        }
      })
    }
  }

  function getOwnerRepos(projects) {
    // Iterates through all projects and returns the below string for GitHub querying.
    // +repo:collab/cs3245+repo:collab/IndoorNavigation
    let ownerRepos = ''
    projects.forEach(project => {
      if (project.github_repo_owner && project.github_repo_name) {
        ownerRepos = ownerRepos + '+repo:' + project.github_repo_owner + '/' + project.github_repo_name
      }
    })
    return ownerRepos
  }

  export function queryIntegrations(queryString) {
    return function(dispatch, getState) {
      let tasks = getState().tasks
      let projects = getState().projects
      let users = getState().users
      let ownerRepos = getOwnerRepos(projects)
      dispatch(_updateAppStatus({
        queryString: queryString,
        searchFilter: 'all'
      }))
      dispatch(initSearchResults([])) // clear the previous results
      let promises = []
      let taskResults = searchTasksByAssignee(queryString, users, tasks, projects)
      dispatch(addSearchResults(taskResults))

      promises.push(Promise.resolve(queryGoogleDrive(queryString)))
      if (ownerRepos) promises.push(Promise.resolve(queryGithub(queryString, ownerRepos)))

      Promise.all(promises.map(function(promise) {
        dispatch(queryProcessing())
        return promise.reflect();
      })).each(function(inspection, i) {
        if (inspection.isFulfilled()) {
          let value = inspection.value()
          if (i === 0) {
            let driveResults = normalizeDriveResults(value.files)
            dispatch(addSearchResults(driveResults))
          } else if (i === 1) {
            let githubResults = normalizeGithubResults(value.items)
            dispatch(addSearchResults(githubResults))
          }
        } else {
          console.error(inspection.reason());
        }
        dispatch(queryDone())
      });
    }
  }

  function normalizeGithubResults(items) {
    return items.map(item => {
      return {
        id: item.sha,
        primaryText: item.path,
        repo: item.repository.full_name,
        link: item.html_url,
        type: 'github',
        text_matches: item.text_matches
      }
    })
  }

  function normalizeDriveResults(files) {
    return files.map(file => {
      return {
        id: file.id,
        primaryText: file.name,
        secondaryText: file.lastModifyingUser.displayName,
        link: file.webViewLink,
        thumbnail: file.iconLink,
        modifiedTime: file.modifiedTime,
        type: 'drive'
      }
    })
  }

  function searchTasksByAssignee(queryString, users, tasks, projects) {
    let options = {
      caseSensitive: false,
      includeScore: false,
      shouldSort: true,
      tokenize: false,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: ["display_name"]
    }
    let fuse = new Fuse(users, options)
    let matchingUsers = fuse.search(queryString)
    let matchingTasks = tasks.filter(task => {
      let found = false
      matchingUsers.forEach(user=> {if (user.id === task.assignee_id) found = true})
      return found
    })

    return matchingTasks.map(task => {
      let assignee = null
      let project = null
      matchingUsers.forEach(user=> {if (user.id === task.assignee_id) assignee = user})
      projects.forEach(p=> {if (p.id === task.project_id) project = p})
      let primaryText = task.content
      if (task.completed_on) {
        primaryText = task.content + ' (completed)'
      }
      return (
        {
          id: task.id,
          primaryText: primaryText,
          secondaryText: assignee.display_name,
          thumbnail: assignee.display_image,
          project_id: project.id,
          project_content: project.content,
          completed_on: task.completed_on,
          type: 'task'
        }
      )
    })
  }
export const initGithubRepos = () => (
  (dispatch) => {
    dispatch(_updateAppStatus({
      github: {
        loading: true,
      },
    }));
    getGithubRepos().then(res => {
      dispatch(_updateAppStatus({
        github: {
          loading: false,
          repo_fetched: true,
        },
      }));
      dispatch(_initGithubRepos(res));
    }).catch(e => {
      dispatch(_updateAppStatus({
        github: {
          loading: false,
        },
      }));
      if (e.statusText === 'Unauthorized') {
        dispatch(_updateAppStatus({ github_token: '' }));
      } else {
        console.log(e);
      }
    });
  }
);
export const updateAppStatus = (obj) => (
  (dispatch) => {
    dispatch(_updateAppStatus(obj));
  }
);
export const dismissProjectAlert = () => (
  (dispatch) => {
    dispatch(projectAlert(null));
  }
);

export const declineProject = (projectId, notificationId) => (
  (dispatch) => {
    serverDeclineProject(projectId).then(() => {
      dispatch(snackbarMessage('Project declined', 'default'));
      serverDeleteNotification(notificationId).then(() => {
        dispatch(_deleteNotification(notificationId));
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => {
      console.log(e);
    });
  }
);

  export function acceptProject(projectId, notificationId) {
    return function(dispatch) {
      serverAcceptProject(projectId).then(res => {
        dispatch(snackbarMessage('Project accepted', 'default'))
        dispatch(_updateAppStatus({
          loading: true
        }));
        dispatch(userIsOnline()) // send online signal again to join the project's socket
        serverPopulate().then(res => {
          if (res.projects.length > 0) {
            let normalizedTables = normalize(res.projects);
            dispatch(initMilestones(normalizedTables.milestones));
            dispatch(initProjects(normalizedTables.projects));
            dispatch(initTasks(normalizedTables.tasks));
            dispatch(initSearchResults([]));
            let u = normalizedTables.users.map(user => {
              user.colour = getNewColour(normalizedTables.users.map(k => k.colour))
              return user
            })
            dispatch(addUsers(u));
            let projectId = getCurrentProject()
            let currentProject = normalizedTables.projects.filter(project => project.id === projectId)[0]
            if (currentProject) {
              dispatch(initializeFiles(currentProject))
            }
          }
          dispatch(_updateAppStatus({
            loading: false
          }));
        })

        serverDeleteNotification(notificationId).done(res => {
          dispatch(_deleteNotification(notificationId))
        }).catch(e => {
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }



  function hasProjectWithoutGithub(projects) {
    for (let i=0; i<projects.length; ++i) {
      let project = projects[i]
      if (!project.github_repo_name || !project.github_repo_owner) return true
    }
    return false
  }

  function hasProjectWithGithub(projects) {
    for (let i=0; i<projects.length; ++i) {
      let project = projects[i]
      if (project.github_repo_name && project.github_repo_owner) return true
    }
    return false
  }


  export function initializeApp() {
    return function(dispatch) {
      dispatch(addUsers([{
        id: localStorage.getItem('user_id'),
        email: localStorage.getItem('email'),
        display_name: localStorage.getItem('display_name'),
        display_image: localStorage.getItem('display_image'),
        online: true,
        colour: getNewColour([]),
        me: true,
      }]));
      dispatch(initApp({
        is_linked_to_drive: true,
        is_top_level_folder_loaded: false,
        github: {
          loading: false,
          repo_fetched: false,
        },
        files: {
          loading: false,
        },
        queriesInProgress: 0,
        loading: true,
        queryString: '',
        searchFilter: 'all',
      }));
      dispatch(initSnackbar({
        isOpen: false,
        message: '',
        background: '',
      }));

      serverPopulate().done(res => {
        if (res.projects.length > 0) {
          let normalizedTables = normalize(res.projects);
          dispatch(_updateAppStatus({
            current_project: normalizedTables.projects[0].id,
            github_token: localStorage.getItem('github_token')
          }));
          dispatch(initMilestones(normalizedTables.milestones));
          dispatch(initProjects(normalizedTables.projects));
          dispatch(initTasks(normalizedTables.tasks));
          dispatch(initSearchResults([]));
          let u = normalizedTables.users.map(user => {
            user.colour = getNewColour(normalizedTables.users.map(k => k.colour))
            return user
          })
          dispatch(addUsers(u));

          dispatch(testGithubRepos(normalizedTables.projects))
          refreshTokens().done(res => {
            localStorage.setItem('google_token', res.access_token);
            localStorage.setItem('expiry_date', res.expires_in * 1000 + new Date().getTime());
            let projectId = getCurrentProject()
            var currentProject = normalizedTables.projects.filter(project => project.id === projectId)[0]
            if (currentProject) {
              dispatch(switchToProject(currentProject))
              dispatch(initializeFiles(currentProject))
              dispatch(switchChatRoom(currentProject.chatroom))
            }

            if (hasProjectWithoutGithub(normalizedTables.projects)) {
              dispatch(initGithubRepos())
            }
            setTimeout(function() {
              dispatch(_updateAppStatus({
                loading: false
              }));
            }, 1000)

          }).fail(e => {
            console.log(e);
          });
        } else {
          refreshTokens().done(res => {
            localStorage.setItem('google_token', res.access_token);
            localStorage.setItem('expiry_date', res.expires_in * 1000 + new Date().getTime());
            dispatch(_updateAppStatus({
              loading: false
            }));
          }).fail(e => {
            console.log(e);
          });
        }
      }).fail(e => {
        console.log(e)
        logout()
      });

      serverGetNotifications().done(res => {
        let users = filterUnique(res.users)
        let u = res.users.map(user => {
          user.colour = getNewColour(users.map(k => k.colour))
          return user
        })

        dispatch(addUsers(u));
        dispatch(initNotifications(res.notifications));
      }).fail(e => {
        console.log(e)
      })

      serverGetNewesfeed().done(res => {
        dispatch(addNewsfeedEvents(res.newsfeed))
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
      serverMarkDone(id, projectId).done(res => {
        dispatch(snackbarMessage('Task completed', 'default'))
      }).fail(e => {
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
      delete task.id
      serverCreateTask(task).done(res => {
        // update the stores with the actual id
        dispatch(snackbarMessage('Task added', 'default'))
        dispatch(replaceTaskId(task.id, res.id));
      }).fail(e => {
        console.log(e);
        dispatch(_deleteTask(task.id));
      });
    }
  }

  export function deleteTask(taskId, projectId) {
    return function(dispatch) {
      dispatch(markAsDirty(taskId))
      serverDeleteTask(taskId, projectId).done(res => {
        dispatch(_deleteTask(taskId));
        dispatch(snackbarMessage('Task deleted', 'default'))
      }).fail(e => {
        dispatch(unmarkDirty(taskId))
        console.log(e);
      });
    }
  }

  export function editTask(task_id, content, assignee_id) {
    let task = {
      content: content,
      assignee_id: assignee_id
    }
    return function(dispatch) {
      serverEditTask(task_id, task)
      .done(res => {
        dispatch(_editTask(task_id, task));
        dispatch(snackbarMessage('Task updated', 'default'))
      }).fail(e => {
        console.log(e);
      });
    }
  }

  export function editMilestone(milestone_id, content, deadline) {
    let milestone = {}
    if (content) {
      milestone.content = content
    }
    milestone.deadline = deadline

    return function(dispatch) {
      serverEditMilestone(milestone_id, milestone)
      .done(res => {
        dispatch(_editMilestone(milestone_id, milestone));
        dispatch(snackbarMessage('Milestone updated', 'default'))
      }).fail(e => {
        console.log(e);
      });
    }
  }

  export function createMilestone(milestone) {
    return function(dispatch) {
      dispatch(_createMilestone(milestone));
      serverCreateMilestone({
        content:milestone.content,
        project_id: milestone.project_id,
        deadline: milestone.deadline
      })
      .done(res => {
        dispatch(replaceMilestoneId(milestone.id, res.id));
        dispatch(snackbarMessage('Milestone created', 'default'))
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
        dispatch(snackbarMessage('Milestone deleted', 'default'))
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
        dispatch(snackbarMessage('Project created', 'default'))
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

  export function reopenTask(taskId) {
    return function(dispatch) {
      dispatch(_unmarkDone(taskId));
      serverEditTask(taskId, {completed_on: null}).done(res => {
        dispatch(snackbarMessage('Task reopened', 'default'))
      }).fail(e => {
        console.log(e);
        dispatch(_markDone(taskId));
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
        github_repo_owner: project.github_repo_owner,
        chatroom: project.chatroom
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


  function getTopLevelFolders(files, rootId) {
    let topLevelFolders = []
    files.forEach(file => {
      if (!file.parents || file.parents[0] === rootId) {
        file.parents = ['root']
        topLevelFolders.push(file)
      }
    })
    return topLevelFolders
  }

  export function initTopLevelFolders(projectId) {
    return function(dispatch) {
      dispatch(_updateAppStatus({
        files: {
          loading: true
        }
      }))
      getFileInfo('root').then(res => {
        let rootId = res.id
        getGoogleDriveFolders().then(res => {
          let topLevelFolders = getTopLevelFolders(res.files, rootId)
          dispatch(addFiles(topLevelFolders))
          dispatch(_updateProject(projectId, {directory_structure: [{name: 'Top level directory', id: 'root'}]}))
          dispatch(_updateAppStatus({
            files: {
              loading: false
            },
            is_top_level_folder_loaded: true
          }))
        }, function (err) {
          console.log(err)
        })
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
      dispatch(_updateAppStatus({
        files: {
          loading: true
        }
      }))
      getChildrenFiles(folderId).then(res => {
        dispatch(addFiles(res.files))
        if (folderName) {
          dispatch(addDirectory(projectId, {id: folderId, name: folderName}))
          dispatch(_updateAppStatus({
            files: {
              loading: false
            }
          }))
        } else {
          getFileInfo(folderId).then(res => {
            dispatch(addDirectory(projectId, {id: folderId, name: res.name}))
            dispatch(_updateAppStatus({
              files: {
                loading: false
              }
            }))
          }, function (err) {
            if (err.responseJSON.error.errors[0].reason === 'notFound') {
              dispatch(snackbarMessage("Either the root folder is deleted, or you don't have permission to view this folder", 'warning'))
              dispatch(_updateProject(projectId, {
                folder_error: "Either the root folder is deleted, or you don't have permission to view this folder"
              }))
            }
            dispatch(_updateAppStatus({
              files: {
                loading: false
              }
            }))
          })
        }
      }, function (err) {
        dispatch(_updateAppStatus({
          files: {
            loading: false
          }
        }))
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
        dispatch(snackbarMessage('Directory set as root', 'default'))
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
        setupGithubWebhook(repoName, repoOwner)
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
            dispatch(snackbarMessage('Synced with GitHub', 'default'))
          }).fail(e => {
            logout()
          });
        })
      }).fail(e => {
        console.log(e)
      })
    }
  }

  export function updateProject(projectId, payload) {
    return function(dispatch) {
      dispatch(_updateProject(projectId, payload))
    }
  }

  export function renameProject(projectId, name) {
    return function(dispatch) {
      serverUpdateProject(projectId, {content: name}).done(res => {
        dispatch(snackbarMessage('Project renamed to ' + name, 'default'))
        dispatch(_updateProject(projectId, {content: name}))
      }).fail(e => {
        console.log(e)
      })
    }
  }

  export function switchToProject(project) {
    return function(dispatch, getState) {
      dispatch(initializeFiles(project))
      dispatch(switchChatRoom(project.chatroom))
      let app = getState().app

      if (!app.github.repo_fetched && !project.github_repo_name) {
        dispatch(initGithubRepos())
      }
      dispatch(_switchToProject(project.id))
    }
  }

  export function changeChatRoom(projectId, name) {
    // change chat room of a particular project
    return function(dispatch) {
      serverUpdateProject(projectId, {chatroom: name}).done(res => {
        dispatch(_updateProject(projectId, {chatroom: name}))
        if (!window.scrollback) {
          dispatch(loadChatRoom(name))
          dispatch(snackbarMessage('Chatroom ' + name + ' loaded', 'default'))
        } else {
          $('.scrollback-toast').remove();
          dispatch(loadChatRoom(name))
          dispatch(snackbarMessage('Chatroom ' + name + ' changed', 'default'))
        }
      }).fail(e => {
        console.error(e)
      })
    }
  }

  export function switchChatRoom(name) {
    // switch chat room from one project to another
    return function(dispatch) {
      if (!name) return
      if (!window.scrollback) {
        dispatch(loadChatRoom(name))
      } else {
        $('.scrollback-toast').remove();
        dispatch(loadChatRoom(name))
      }
    }
  }

  export function loadChatRoom(name) {
    return function(dispatch) {
      window.scrollback = {
        "room":name,"form":"toast","minimize":true
      };
      (function(d, s, h, e) {
        //d: document object
        //s: script
        e = d.createElement(s);
        e.async = 1;
        e.src = (location.protocol === "https:" ? "https:" : "http:") +
          "//scrollback.io/client.min.js";
        d.getElementsByTagName(s)[0].parentNode.appendChild(e);
      }(document, "script"));
    }
  }
