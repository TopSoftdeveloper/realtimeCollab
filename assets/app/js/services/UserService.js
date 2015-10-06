var UserActions = require('../actions/UserActions');

module.exports = {
    init: function() {
        UserActions.init();
    },
    logOut: function() {
        UserActions.logOut();
    }
};
