var constants = require('../../constants')

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
            default:
                message = ''
        }
        return message
    },

    getLink: function(notification_id) {
        return  constants.BASE_URL + '/app/notifications/' + notification_id
    },

    INVITE_TO_PROJECT: 'INVITE_TO_PROJECT',
    JOINED_PROJECT: 'JOINED_PROJECT',
    DECLINED_PROJECT: 'DECLINED_PROJECT'
}