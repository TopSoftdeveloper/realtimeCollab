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

function idToNames(data) {
    var promises = []
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

    removeNotification: {
        handler: removeNotification
    },

    newUserNotification: function(data, template, recipientId) {
        /**
         * 'data' can have user_id, project_id which will be translated into
         *  names and inserted into the respective template if needed
         */
        storage.saveNotification(JSON.stringify(data), template, recipientId).then(function(notification) {
            idToNames(data).done(function(res) {
                console.log(res)
                var displayName = res[0].display_name
                var projectName = res[1].content
                var message = templates.getMessage(template, {displayName: displayName, projectName: projectName})
                var link = templates.getLink(notification.id)
                this.broadcastToUser(recipientId, notification.id, message, notification.created_at, link, data)
            }.bind(this))
        }.bind(this), function(err) {
            console.error(err)
        })
    },

    newProjectNotification: function(data, template, projectId, ignoreId) {
        storage.getUsersOfProject(projectId).then(function(users) {
            users.forEach(function(user) {
                if (user.id !== ignoreId) {
                    this.newUserNotification(data, template, user.id)
                }
            }.bind(this))
        }.bind(this))
    },

    broadcastToUser: function(userId, id, text, time, link, template, meta) {
        var payload = {
            id: id,
            text: text,
            time: time,
            read: false,
            link: link,
            type: template,
            meta: meta
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

function removeNotification(request, reply) {
    storage.removeNotification(request.params.notification_id).then(function() {
        reply({status: 'OK'})
    }, function(err) {
        console.log(err)
        reply(Boom.badRequest(err))
    })
}

function getNotifications(request, reply) {
    Jwt.verify(helper.getTokenFromAuthHeader(request.headers.authorization), secret_key, function(err, decoded) {
        storage.getNotifications(decoded.user_id).then(function(notifications) {
            var promises = []
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
                        var data = JSON.parse(notif.data)
                        return {
                            id: notif.id,
                            text: message,
                            time: notif.created_at,
                            read: notif.is_read,
                            link: templates.getLink(notif.id),
                            type: notif.template,
                            meta: {
                                project_id: data.project_id
                            }
                        }
                    })
                })
            })

        })
    })
}