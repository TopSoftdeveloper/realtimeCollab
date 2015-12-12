var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.NOTIFICATION_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        data: DataTypes.STRING,
        template: DataTypes.STRING,
        is_read: DataTypes.BOOLEAN
    },{
        underscored: true
    });
};