import io from 'socket.io-client'
let host = 'ws://localhost:4001/'
let socket = io.connect(host)
import * as Actions from '../actions/ReduxTaskActions'
var templates = require('../../../../server/templates.js')

export function userIsOnline() {
    // informs server that the current logged in user is online
    return function(dispatch) {
        socket.emit('is_online', {user_id: localStorage.getItem('user_id')})
    }
}

export function userIsEditing(type, targetId) {
    // targetId is the id of the task/milestone the user is editing
    return function(dispatch) {
        socket.emit('is_editing', {type: type, id: targetId, user_id: localStorage.getItem('user_id')})
    }
}

export function userStopsEditing(type, targetId) {
    // targetId is the id of the task/milestone the user is editing
    return function(dispatch) {
        socket.emit('stop_editing', {type: type, id: targetId, user_id: localStorage.getItem('user_id')})
    }
}

export function monitorEditStatus() {
    return function(dispatch) {
        socket.on('is_editing', (data) => {
            dispatch(Actions.userEditing(data.type, data.id, data.user_id))
            setTimeout(function() {
                dispatch(Actions.userStopEditing(data.type, data.id, data.user_id))
            }, 20000)
        })
        socket.on('stop_editing', (data) => {
            dispatch(Actions.userStopEditing(data.type, data.id, data.user_id))
        })
    }
}

export function monitorOnlineStatus() {
    return function(dispatch) {
        socket.on('teammate_online', (data) => {
            dispatch(Actions.userOnline(data.user_id));
        })
        socket.on('teammate_offline', (data) => {
            dispatch(Actions.userOffline(data.user_id));
        })
    }
}

function getName(sender, users) {
    // returns sender name if sender exists but is not current user
    if (sender === localStorage.getItem('user_id')) return false
    let name = users.filter(user => user.id === sender)[0]
    if (name) {
        return name.display_name
    }
    return false
}

export function monitorProjectChanges() {
    return function(dispatch, getState) {
        socket.on('new_task', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                dispatch(Actions.snackbarMessage(name + ' added the task ' + data.task.content, 'info'))
                dispatch(Actions._addTask(data.task));
            }
        })
        socket.on('update_task', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' updated the task ' + taskName, 'info'))
                dispatch(Actions._editTask(data.task_id, data.task));
            }
        })
        socket.on('mark_done', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' completed the task ' + taskName, 'info'))
                dispatch(Actions._markDone(data.task_id));
            }
        })
        socket.on('delete_task', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let taskName = getState().tasks.filter(task => task.id === data.task_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' deleted the task ' + taskName, 'info'))
                dispatch(Actions._deleteTask(data.task_id));
            }
        })
        socket.on('new_milestone', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                dispatch(Actions.snackbarMessage(name + ' created the milestone ' + data.milestone.content, 'info'))
                dispatch(Actions._createMilestone(data.milestone));
            }
        })
        socket.on('update_milestone', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let milestoneName = getState().milestones.filter(m => m.id === data.milestone_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' updated the milestone ' + milestoneName, 'info'))
                dispatch(Actions._editMilestone(data.milestone_id, data.milestone));
            }
        })
        socket.on('delete_milestone', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let milestoneName = getState().milestones.filter(m => m.id === data.milestone_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' deleted the milestone ' + milestoneName, 'info'))
                dispatch(Actions._deleteMilestone(data.milestone_id));
            }
        })
        socket.on('update_project', (data) => {
            let name = getName(data.sender, getState().users)
            if (name) {
                let projectName = getState().projects.filter(p => p.id === data.project_id)[0].content
                dispatch(Actions.snackbarMessage(name + ' updated the project ' + projectName, 'info'))
                dispatch(Actions._editMilestone(data.project_id, data.project));
            }
        })
        socket.on('newsfeed_post', (event) => {
            let data = JSON.parse(event.data)
            let targetUser = getState().users.filter(user => user.id === data.user_id)
            if (targetUser.length === 1) {
                targetUser = targetUser[0]
                data.displayName = targetUser.display_name
                dispatch(Actions.snackbarMessage(templates.getMessage(event.template, data)), 'info')
            }
            dispatch(Actions.addNewsfeedEvents([event]));
        })
    }
}

export function monitorNotifications() {
    return function(dispatch) {
        socket.on('new_notification', (data) => {
            dispatch(Actions.addUsers([data.user]))
            dispatch(Actions.newNotification(data.notification))
            dispatch(Actions.snackbarMessage(data.notification.text, 'info'))
        })
    }
}