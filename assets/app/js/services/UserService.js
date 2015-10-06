var UserActions = require('../actions/UserActions');
var Cookies = require('cookies-js');

module.exports = {
    update: function() {
        UserActions.update({
            jwt: Cookies('jwt'),
            user_id: Cookies('user_id'),
            email: Cookies('email')
        });
    }
};
