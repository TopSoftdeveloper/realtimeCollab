import { createSelector } from 'reselect'

const getMilestones = (state) => state.milestones
const getTasks = (state) => state.tasks
const getProjectId = (state) => state.app.current_project
const getNewsfeeds = (state) => state.newsfeed

export const getProjectMilestones = createSelector(
  [ getMilestones, getProjectId ],
  (milestones, projectId) => {
    return milestones.filter(milestone => milestone.project_id === projectId)
  }
)

export const getProjectTasks = createSelector(
  [ getTasks, getProjectId ],
  (tasks, projectId) => {
    return tasks.filter(task => task.project_id === projectId)
  }
)

export const getProjectEvents = createSelector(
  [ getNewsfeeds, getProjectId ],
  (events, projectId) => {
    return events.filter(event => event.project_id === projectId)
  }
)

// export const getActiveUsers =
