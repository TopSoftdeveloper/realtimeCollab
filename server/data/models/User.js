var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.USER_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        }
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
