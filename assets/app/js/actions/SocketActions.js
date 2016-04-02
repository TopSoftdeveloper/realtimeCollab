import io from 'socket.io-client'
let host = 'ws://localhost:4001/'
let socket = io.connect(host)
import * as Actions from '../actions/ReduxTaskActions'

export function userIsOnline() {
    return function(dispatch) {
        socket.emit('is_online', {user_id: localStorage.getItem('user_id')})
        dispatch(Actions.userOnline(localStorage.getItem('user_id')))
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

export function monitorProjectChanges() {
    return function(dispatch) {
        socket.on('new_task', (data) => {
            if (data.sender !== localStorage.getItem('user_id')) {
                dispatch(Actions._addTask(data.task));
            }
        })
        socket.on('mark_done', (data) => {
            if (data.sender !== localStorage.getItem('user_id')) {
                dispatch(Actions._markDone(data.task_id));
            }
        })
        socket.on('delete_task', (data) => {
            if (data.sender !== localStorage.getItem('user_id')) {
                dispatch(Actions._deleteTask(data.task_id));
            }
        })
        socket.on('new_milestone', (data) => {
            if (data.sender !== localStorage.getItem('user_id')) {
                dispatch(Actions._createMilestone(data.milestone));
            }
        })
        socket.on('delete_milestone', (data) => {
            if (data.sender !== localStorage.getItem('user_id')) {
                dispatch(Actions._deleteMilestone(data.milestone_id));
            }
        })
    }
}

export function monitorNotifications() {
    return function(dispatch) {
        socket.on('new_notification', (data) => {
            dispatch(Actions.addUsers([data.user]))
            dispatch(Actions.newNotification(data.notification))
        })
    }
}