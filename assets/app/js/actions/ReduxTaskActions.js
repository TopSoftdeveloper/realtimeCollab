import {serverCreateTask, serverDeleteTask, serverMarkDone, 
        serverPopulate, serverCreateMilestone, serverCreateProject,
        serverInviteToProject} from '../apiUtils/apiUtil'
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

export const loadTasks = makeActionCreator(AppConstants.LOAD_TASKS, 'milestones');
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

export function dismissProjectAlert() {
    return function(dispatch) {
        dispatch(projectAlert(null))
    }
}

const notifState = [
    {
        id: 'notif-1',
        text: 'Cristina invited you to the project CS3201',
        time: new Date().toISOString(), 
        link: 'http://www.nus.edu.sg/',
        read: false
    },
    {
        id: 'notif-2',            
        text: 'Ken uploaded a file in CG3002',
        time: new Date().toISOString(), 
        link: 'http://www.nus.edu.sg/',            
        read: false
    }
];

export function initializeApp() {
    return function(dispatch) {
        dispatch(initUsers([{
            id: sessionStorage.getItem('user_id'),
            email: sessionStorage.getItem('email'),
            display_name: sessionStorage.getItem('display_name')
        }]));                

        serverPopulate().done(res => {
            if (res.projects.length > 0) {
                let normalizedTables = normalize(res.projects);
                dispatch(initApp({current_project: normalizedTables.projects[0].id}));
                dispatch(initMilestones(normalizedTables.milestones));
                dispatch(initNotifications(notifState));
                dispatch(initProjects(normalizedTables.projects));
                dispatch(initTasks(normalizedTables.tasks));
                dispatch(initUsers(normalizedTables.users));
            }
        }).fail(e => {
            window.location.assign('http://localhost:4000');
        });
    }
}

export function markDone(id) {
    return function(dispatch) {
        dispatch(_markDone(id));
        serverMarkDone(id).done(res => {}).fail(e => {
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
	    serverCreateTask({content: task.content, milestone_id: task.milestone_id})
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

export function createProject(content) {
    let tempId = _.uniqueId('project');
    let project = {
        id: tempId,
        content: content,
        milestones: []
    }    
    return function(dispatch) {
        dispatch(_createProject(project));
        dispatch(switchToProject(tempId))
        serverCreateProject({content:content})
        .done(res => {
            dispatch(replaceProjectId(tempId, res.project_id));
            dispatch(switchToProject(res.project_id))
        }).fail(e => {
            console.log(e);
            dispatch(_deleteProject(tempId));
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

export function deleteTask(taskId) {
	return function(dispatch) {
		dispatch(markAsDirty(taskId));
		serverDeleteTask(taskId).done(res => {
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
        return item.id == id;
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