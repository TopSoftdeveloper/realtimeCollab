var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.USER_PROJECT, {
        role: DataTypes.STRING
    },{
        underscored: true
    });
};