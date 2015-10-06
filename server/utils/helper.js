const TOKEN_START_POS = 7;

module.exports = {
    getTokenFromAuthHeader: function(auth_header) {
        return auth_header.slice(TOKEN_START_POS);
    }
};
