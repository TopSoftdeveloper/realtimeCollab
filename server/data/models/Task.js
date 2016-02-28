var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.TASK_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        deadline: DataTypes.DATE,
        completed_on: DataTypes.DATE,
        is_time_specified: DataTypes.BOOLEAN,
        github_id: DataTypes.STRING
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