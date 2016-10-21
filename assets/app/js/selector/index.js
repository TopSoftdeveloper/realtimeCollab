import { createSelector } from 'reselect'
import {isProjectPresent} from '../utils/collection'
import {isItemPresent} from '../utils/general'
const getMilestones = (state) => state.milestones
const getTasks = (state) => state.tasks
const getProjectId = (state) => state.app.current_project
const getNewsfeeds = (state) => state.newsfeed
const getUsers = (state) => state.users
const getProjects = (state) => state.projects

export const getCurrentProject = createSelector(
  [ getProjects, getProjectId ],
  (projects, projectId) => {
    if (isProjectPresent(projects, projectId)) {
      return projects.filter(project => project.id === projectId)[0];
    } else {
      return null
    }
  }
)

export const getProjectActiveUsers  = createSelector(
  [ getUsers, getCurrentProject ],
  (users, project) => {
    let actievUsers = []
    if(project) {
      let basicUserIds = project.basic
      basicUserIds.push(project.creator)
      actievUsers = users.filter(user => isItemPresent(basicUserIds, user.id));
    }
    return actievUsers
  }
)

export const getProjectPendingUsers  = createSelector(
  [ getUsers, getCurrentProject ],
  (users, project) => {
    let pendingUsers = []
    if(project) {
      let pendingUserIds = project.pending;
      pendingUsers = users.filter(user => isItemPresent(pendingUserIds, user.id));
    }
    return pendingUsers
  }
)

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
