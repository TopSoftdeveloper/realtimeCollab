var constants = require('./constants')

module.exports = {
    getMessage: function(template, data) {
        var message = ''
        switch (template){
            case this.INVITE_TO_PROJECT:
                message = data.displayName + ' has invited you to the project ' + data.projectName
                break
            case this.JOINED_PROJECT:
                message = data.displayName + ' has joined the project ' + data.projectName
                break
            case this.DECLINED_PROJECT:
                message = data.displayName + ' has declined to join the project ' + data.projectName
                break
            case this.GITHUB_CREATE:
                message = data.displayName + ' has created the ' + data.ref_type + ' ' + data.ref
                break
            case this.GITHUB_PUSH:
                message = data.displayName + ' has pushed ' + data.commitSize + ' commits'
                break
            case this.DRIVE_REMOVE:
                message = data.displayName + ' has removed the file ' + data.fileName
                break
            case this.DRIVE_UPDATE:
                message = data.displayName + ' has updated the file ' + data.fileName
                break
            default:
                message = ''
        }
        return message
    },

    getLink: function(notification_id) {
        return  ''
    },

    INVITE_TO_PROJECT: 'INVITE_TO_PROJECT',
    JOINED_PROJECT: 'JOINED_PROJECT',
    DECLINED_PROJECT: 'DECLINED_PROJECT',
    GITHUB_CREATE: 'GITHUB_CREATE',
    GITHUB_PUSH: 'GITHUB_PUSH',
    DRIVE_REMOVE: 'DRIVE_REMOVE',
    DRIVE_UPDATE: 'DRIVE_UPDATE'
}