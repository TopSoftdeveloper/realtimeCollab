var AppConstants = require('../AppConstants');

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
export const addTask = makeActionCreator(AppConstants.ADD_TASK, 'task');
export const deleteTask = makeActionCreator(AppConstants.DELETE_TASK, 'id');
export const markAsDirty = makeActionCreator(AppConstants.MARK_AS_DIRTY, 'id');
export const unmarkDirty = makeActionCreator(AppConstants.UNMARK_DIRTY, 'id');
export const markDone = makeActionCreator(AppConstants.MARK_DONE, 'id');
export const unmarkDone = makeActionCreator(AppConstants.UNMARK_DONE, 'id');
export const createMilestone = makeActionCreator(AppConstants.CREATE_MILESTONE, 'milestone');