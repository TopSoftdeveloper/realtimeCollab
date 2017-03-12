var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.PROJECT_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        root_folder: DataTypes.STRING,
        chatroom: DataTypes.STRING,
        github_repo_name: DataTypes.STRING,
        github_repo_owner: DataTypes.STRING
    },{
        underscored: true,
        classMethods: {
            isExist: function(id) {
                return this.findById(id).then(function(instance) {
                    return instance !== null;
                })
            }
        }
    });
};
