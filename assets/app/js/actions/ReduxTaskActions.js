import {serverCreateTask, serverDeleteTask, serverMarkDone, 
        serverPopulate, serverCreateMilestone} from '../apiUtils/apiUtil'
import assign from 'object-assign';

let AppConstants = require('../AppConstants');

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

export const switchToProject = makeActionCreator(AppConstants.SWITCH_TO_PROJECT, 'project_id');

export const initApp = makeActionCreator(AppConstants.INIT_APP, 'app');
export const initMilestones = makeActionCreator(AppConstants.INIT_MILESTONES, 'milestones');
export const initNotifications = makeActionCreator(AppConstants.INIT_NOTIFICATIONS, 'notifications');
export const initProjects = makeActionCreator(AppConstants.INIT_PROJECTS, 'projects');
export const initTasks = makeActionCreator(AppConstants.INIT_TASKS, 'tasks');
export const initUsers = makeActionCreator(AppConstants.INIT_USERS, 'users');

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
            }
        }).fail(e => {
            console.log(e);
            window.location.replace('http://localhost:4000');
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
  	// the Store status, so get ive it the "dispatch function"
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

function normalize(projects) {
    /* 
    * Normalizes nested API response for ease of manipulation in
    * redux state-tree
    */
    let projectState = [];
    let milestoneState = [];
    let taskState = [];
    projects.forEach(project => {
        // project table
        let currProj = assign({}, project, {milestones: []});
        currProj.milestones = project.milestones.map(milestone => milestone.id);
        projectState.push(currProj);
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
    });
    return {
        projects: projectState, 
        milestones: milestoneState,
        tasks:taskState
    };
}

let mockRes = {
    "projects": [
        {
            "id": "EkszSYTWe",
            "content": "heya",
            "milestones": [
                    {
            "id": "V1MXXvpWx",
            "content": "write mid term report",
            "deadline": null,
            "tasks": [
                {
                    "id": "4kwwXDT-l",
                    "content": "blah",
                    "deadline": null,
                    "completed_on": null,
                    "is_time_specified": false
                },
                {
                    "id": "EkadzO6-x",
                    "content": "zookey",
                    "deadline": null,
                    "completed_on": null,
                    "is_time_specified": false
                }
            ]
        }]
        },
        {
            "id": "Vkz-7vT-x",
            "content": "Final Year Project",
            "milestones": [
                {
                    "id": "V1MXXvaspWx",
                    "content": "Sundown Marathon",
                    "deadline": null,
                    "tasks": [
                        {
                            "id": "4kwwXhtDT-l",
                            "content": "Interval training",
                            "deadline": null,
                            "completed_on": null,
                            "is_time_specified": false
                        },
                        {
                            "id": "Eaoasfx",
                            "content": "Swimming",
                            "deadline": null,
                            "completed_on": null,
                            "is_time_specified": false
                        }
                    ]
                }                
            ]
        }
    ]
};

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

