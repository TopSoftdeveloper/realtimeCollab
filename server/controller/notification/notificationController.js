var templates = require('./templates')
var storage = require('../../data/storage')
var socket = require('../socket/handlers')
var helper = require('../../utils/helper')
var Jwt = require('jsonwebtoken')
var config = require('config')
var secret_key = config.get('authentication.privateKey')
var Sequelize = require('sequelize');
var Boom = require('boom');
var _ = require('lodash')
var promises = []

function idToNames(data) {
    // convert ID to names only when needed, as names might change
    if (data.user_id) {
        promises.push(storage.findUserById(data.user_id))
    }

    if (data.project_id) {
        promises.push(storage.getProject(data.project_id))
    }
    return Sequelize.Promise.all(promises)
}

module.exports = {
    getNotifications: {
        handler: getNotifications
    },

    updateNotification: {
        handler: updateNotification,
        payload: {
            parse: true
        }
    },

    newUserNotification: function(data, template, recipientId) {
        storage.saveNotification(JSON.stringify(data), template, recipientId).then(function(notification) {
            idToNames(data).done(function(res) {
                var displayName = res[0].display_name
                var projectName = res[1].content
                var message = templates.getMessage(template, {displayName: displayName, projectName: projectName})
                var link = templates.getLink(notification.id)
                this.broadcastToUser(recipientId, notification.created_at, message, link)
            }.bind(this))
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

function updateNotification(request, reply) {
    var notificationId = request.params.notification_id
    var payload = request.payload
    if (!payload) {
        reply(Boom.badRequest())
        return
    }
    storage.updateNotification(notificationId, payload).then(function(x) {
        reply({status: 'OK'})
    }, function(err) {
        reply(err)
    })
}

function getNotifications(request, reply) {
    var promises = []
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.getNotifications(decoded.user_id).then(function(notifications) {
            notifications.forEach(function(notification) {
                promises.push(idToNames(JSON.parse(notification.data)))
            })
            Sequelize.Promise.all(promises).done(function(res) {
                var names = res.map(function(obj) {
                    return {
                        displayName: obj[0].display_name,
                        projectName: obj[1].content
                    }
                })

                var mergedNotifs = _.merge(names, JSON.parse(JSON.stringify(notifications)))

                reply({
                    notifications: mergedNotifs.map(function(notif) {
                        var message = templates.getMessage(notif.template, {
                            displayName: notif.displayName,
                            projectName: notif.projectName
                        })
                        return {
                            id: notif.id,
                            text: message,
                            time: notif.created_at,
                            read: notif.is_read,
                            link: templates.getLink(notif.id)
                        }
                    })
                })
            })

        })
    })
}