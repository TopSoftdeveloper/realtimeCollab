var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.TASK_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        deadline: DataTypes.DATE,
        is_time_specified: DataTypes.BOOLEAN,
        milestone_id: {
            type: DataTypes.STRING,
            references: {
                model: constants.MILESTONE_MODEL_NAME,
                key: "id"
            }
        },
        project_id: DataTypes.STRING
    }, {
        classMethods: {
            isExist: function(id) {
                return this.findById(id).then(function(instance) {
                    return instance !== null;
                })
            }
        }
    });
};