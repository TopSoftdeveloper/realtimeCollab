const TOKEN_START_POS = 7;
var storage = require('../data/storage')
var Sequelize = require('sequelize');

module.exports = {
    getTokenFromAuthHeader: function(auth_header) {
        return auth_header.slice(TOKEN_START_POS);
    },
    idToNames: function(data) {
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
};
