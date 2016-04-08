var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.TASK_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        completed_on: DataTypes.DATE,
        github_id: DataTypes.BIGINT,
        github_number: DataTypes.INTEGER,
        assignee_id: DataTypes.STRING
    },{
        underscored: true,
        classMethods: {
            isExist: function(id) {
                return this.findById(id).then(function(instance) {
                    return instance !== null;
                })
            },
            getTask: function(id) {
                return this.findById(id);
            }
        }
    });
};