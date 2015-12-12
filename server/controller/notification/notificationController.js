var templates = require('./templates')
var storage = require('../../data/storage')
var socket = require('../socket/handlers')

module.exports = {
    newUserNotification: function(data, template, recipientId) {
        storage.saveNotification(JSON.stringify(data), template, recipientId).then(function(notification) {
            var message = templates.getMessage(template, data)
            var link = templates.getLink(notification.id)
            this.broadcastToUser(recipientId, notification.created_at, message, link)
        }.bind(this), function(err) {
            console.error(err)
        })
    },

    newProjectNotification: function(template, userId) {

    },

    broadcastToUser: function(userId, createdTime, message, redirectLink) {
        var payload = {
            created_time: createdTime,
            message: message,
            redirect_link: redirectLink
        }
        socket.sendMessageToUser(userId, 'new_notification', payload)
    },

    broadcastToProject: function(notification) {

    }
};