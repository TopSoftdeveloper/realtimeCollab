var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.USER_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        google_id: DataTypes.STRING,
        email: DataTypes.STRING,
        github_login: DataTypes.STRING,
        github_token: DataTypes.STRING,
        google_token: DataTypes.STRING,
        display_name: DataTypes.STRING,
        display_image: DataTypes.STRING,
        refresh_token: DataTypes.STRING
    },{
        underscored: true,
        classMethods: {
            isExist: function(email) {
                return this.find({
                    where: {
                        email: email
                    }
                }).then(function(instance) {
                    return instance !== null;
                })
            },
            getUserById: function(id) {
                return this.findById(id);
            }
        }
    });
};
