import AppConstants from '../AppConstants';
import assign from 'object-assign';


export default function milestones(state = initialState, action) {
    switch (action.type) {
        case AppConstants.LOAD_TASKS:
            return action.milestones;
        case AppConstants.CREATE_MILESTONE:
            // Check whether this milestone is unique
            let milestones_same_id = _store.filter(
                milestone => milestone.id === action.milestone.id
            );
            if (milestones_same_id.length === 0) {
                return [action.milestone].concat(state);
            }
            return state;
        case AppConstants.DELETE_MILESTONE:
            return state.filter(function(milestone) {
                return milestone.id !== action.id;
            });
        case AppConstants.MARK_AS_DIRTY:
            return state.map(milestone =>
                Object.assign({}, milestone, {
                    tasks: milestone.tasks.map(task =>
                        task.id === action.id? 
                        Object.assign({}, task, {dirty: true}): task
                    ) 
                })          
            );
        case AppConstants.UNMARK_DIRTY:
            return state.map(milestone =>
                Object.assign({}, milestone, {
                    tasks: milestone.tasks.map(task =>
                        task.id === action.id? 
                        Object.assign({}, task, {dirty: false}): task
                    ) 
                })          
            );
        case AppConstants.REPLACE_MILESTONE_ID:
            return state.map(function(milestone) {
                return milestone.id === action.original ?
                    assign({}, milestone, {id: replacement}) : milestone;
            });
        case AppConstants.ADD_TASK:
            return state.map(
                milestone => milestone.id === action.milestone_id ?
                Object.assign({}, milestone, {
                    tasks: [action.task, ...milestone.tasks]        
                }) : milestone         
            );
        case AppConstants.DELETE_TASK:
            return state.map(milestone => 
                Object.assign({}, milestone, {
                    tasks: milestone.tasks.filter(task => 
                        task.id !== action.id
                    )}
                ) 
            );                   
        
        case AppConstants.MARK_DONE:
            return state.map(milestone =>
                Object.assign({}, milestone, {
                    tasks: milestone.tasks.map(task =>
                        task.id === action.id? 
                        Object.assign({}, task, {completed_on : new Date().toISOString()}): task
                    ) 
                })          
            );
        case AppConstants.UNMARK_DONE:
            return state.map(milestone =>
                Object.assign({}, milestone, {
                    tasks: milestone.tasks.map(task =>
                        task.id === action.id? 
                        Object.assign({}, task, {completed_on : null}): task
                    ) 
                })          
            );
        case AppConstants.REPLACE_TASK_ID:
            return state.map(function(milestone) {
                return milestone.tasks.map(function(task) {
                    return task.id === action.original ?
                        assign({}, task, {id : action.replacement}) : task;
                })
            });
        default:
            return state;
    }
};

const initialState = [
    {
        "id": "4y2BsfRye",
        "content": "Do user surveys",
        "deadline": null,
        "created_at": "2015-10-07T14:28:59.000Z",
        "updated_at": "2015-10-07T14:28:59.000Z",
        "project_id": "NJ-5My0Jg",
        "tasks": [
            {
                "id": "4yNKiG0kl",
                "content": "Prepare survey  questions",
                "deadline": null,
                "completed_on": "2015-10-08T02:58:20.000Z",
                "is_time_specified": false,
                "created_at": "2015-10-07T14:29:55.000Z",
                "updated_at": "2015-10-08T02:58:20.000Z"
            },
            {
                "id": "NkIOoGC1x",
                "content": "Send out invitations",
                "deadline": null,
                "completed_on": "2015-10-08T02:58:22.000Z",
                "is_time_specified": false,
                "created_at": "2015-10-07T14:29:41.000Z",
                "updated_at": "2015-10-08T02:58:22.000Z"
            }
        ]
    },
    {
        "id": "EJupuQ0kg",
        "content": "Uncategorized",
        "deadline": null,
        "created_at": "2015-10-07T15:26:31.000Z",
        "updated_at": "2015-10-07T15:26:31.000Z",
        "project_id": "NJ-5My0Jg",
        "tasks": [
            {
                "id": "4ygua_XRJe",
                "content": "do power point slides",
                "deadline": null,
                "completed_on": null,
                "is_time_specified": false,
                "created_at": "2015-10-07T15:26:31.000Z",
                "updated_at": "2015-10-07T15:26:31.000Z"
            },
            {
                "id": "N1T2iTA1g",
                "content": "test 2",
                "deadline": null,
                "completed_on": null,
                "is_time_specified": false,
                "created_at": "2015-10-08T03:01:49.000Z",
                "updated_at": "2015-10-08T03:01:49.000Z"
            },
            {
                "id": "VJLegB0yg",
                "content": "take photographs",
                "deadline": null,
                "completed_on": null,
                "is_time_specified": false,
                "created_at": "2015-10-07T17:05:25.000Z",
                "updated_at": "2015-10-07T17:05:25.000Z"
            }
        ]
    }
];