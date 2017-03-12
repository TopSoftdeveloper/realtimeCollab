import io from 'socket.io-client';
import * as AppConstants from '../AppConstants';
import templates from '../../../../server/templates.js';
import * as Actions from './ReduxTaskActions.js';

const host = AppConstants.HOSTNAME;
const socket = io.connect(host);

/* global localStorage */
// informs server that the current logged in user is online
export const userIsOnline = () => (
  () => {
    socket.emit('is_online', { user_id: localStorage.getItem('user_id') });
  }
);

// targetId is the id of the task/milestone the user is editing
export const userIsEditing = (type, targetId) => (
  () => {
    socket.emit('is_editing', { type, id: targetId, user_id: localStorage.getItem('user_id') });
  }
);

// targetId is the id of the task/milestone the user is editing
export const userStopsEditing = (type, targetId) => (
  () => {
    socket.emit('stop_editing', { type, id: targetId, user_id: localStorage.getItem('user_id') });
  }
);
export const monitorEditStatus = () => (
  dispatch => {
    socket.on('is_editing', data => {
      dispatch(Actions.userEditing(data.type, data.id, data.user_id));
      setTimeout(() => {
        dispatch(Actions.userStopEditing(data.type, data.id, data.user_id));
      }, 20000);
    });
    socket.on('stop_editing', data => {
      dispatch(Actions.userStopEditing(data.type, data.id, data.user_id));
    });
  }
);

export const monitorOnlineStatus = () => (
  dispatch => {
    socket.on('teammate_online', data => {
      dispatch(Actions.userOnline(data.user_id));
    });
    socket.on('teammate_offline', data => {
      dispatch(Actions.userOffline(data.user_id));
    });
  }
);

const getName = (sender, users) => {
  // returns sender name if sender exists but is not current user
  if (sender === localStorage.getItem('user_id')) {
    return false;
  }
  const name = users.filter(user => user.id === sender)[0];
  if (name) {
    return name.display_name;
  }
  return false;
};
/* eslint no-underscore-dangle: "off" */

export const monitorProjectChanges = () => (
  (dispatch, getState) => {
    socket.on('new_task', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        dispatch(Actions.snackbarMessage(`${name} added the task ${data.task.content}`, 'info'));
        dispatch(Actions._addTask(data.task));
      }
    });
    socket.on('update_task', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content;
        dispatch(Actions.snackbarMessage(`${name} updated the task ${taskName}`, 'info'));
        dispatch(Actions._editTask(data.task_id, data.task));
      }
    });
    socket.on('mark_done', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content;
        dispatch(Actions.snackbarMessage(`${name} completed the task ${taskName}`, 'info'));
        dispatch(Actions._markDone(data.task_id));
      }
    });
    socket.on('delete_task', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content;
        dispatch(Actions.snackbarMessage(`${name} deleted the task ${taskName}`, 'info'));
        dispatch(Actions._deleteTask(data.task_id));
      }
    });
    socket.on('new_milestone', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        dispatch(Actions.snackbarMessage(`${name} created the milestone ${data.milestone.content}`,
          'info'));
        dispatch(Actions._createMilestone(data.milestone));
      }
    });
    socket.on('update_milestone', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const milestoneName = getState().milestones.filter(m =>
          m.id === data.milestone_id
        )[0].content;
        dispatch(Actions.snackbarMessage(`${name} updated the milestone ${milestoneName}`, 'info'));
        dispatch(Actions._editMilestone(data.milestone_id, data.milestone));
      }
    });
    socket.on('delete_milestone', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const milestoneName = getState().milestones.filter(m =>
          m.id === data.milestone_id
        )[0].content;
        dispatch(Actions.snackbarMessage(`${name} deleted the milestone ${milestoneName}`, 'info'));
        dispatch(Actions._deleteMilestone(data.milestone_id));
      }
    });
    socket.on('update_project', (data) => {
      const name = getName(data.sender, getState().users);
      if (name) {
        const projectName = getState().projects.filter(p => p.id === data.project_id)[0].content;
        dispatch(Actions.snackbarMessage(`${name} updated the project ${projectName}`, 'info'));
        dispatch(Actions._editMilestone(data.project_id, data.project));
      }
    });
    socket.on('newsfeed_post', (event) => {
      if (!event.data) {
        return;
      }
      const data = JSON.parse(event.data);
      let targetUser = getState().users.filter(user => user.id === data.user_id);
      if (targetUser.length === 1 && targetUser[0].id !== localStorage.getItem('user_id')) {
        targetUser = targetUser[0];
        data.displayName = targetUser.display_name;
        if (event.template === templates.DRIVE_UPLOAD) {
          setTimeout(() => {
            dispatch(Actions.snackbarMessage(templates.getMessage(event.template, data)), 'info');
            dispatch(Actions.initializeFiles(event.project_id));
          }, 1000);
        }
      }
      dispatch(Actions.addNewsfeedEvents([event]));
    });
    socket.on('add_discussion_Message', (data) => {
      dispatch(Actions.addMessage(data));
    });
  }
);

export const monitorNotifications = () => (
  dispatch => {
    socket.on('new_notification', (data) => {
      dispatch(Actions.addUser(data.user));
      dispatch(Actions.newNotification(data.notification));
      dispatch(Actions.snackbarMessage(data.notification.text, 'info'));
      if (data.notification.type === templates.JOINED_PROJECT) {
        dispatch(Actions.userOnline(data.user.id));
        dispatch(Actions.joinProject(data.notification.meta.project_id, data.user.id));
      }
    });
  }
);
