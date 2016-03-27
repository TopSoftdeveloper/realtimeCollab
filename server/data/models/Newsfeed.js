var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.NEWSFEED_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        data: DataTypes.STRING,
        template: DataTypes.STRING
    },{
        underscored: true
    });
};