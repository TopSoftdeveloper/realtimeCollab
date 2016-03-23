var constants = require('../../constants');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(constants.MILESTONE_MODEL_NAME, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        deadline: DataTypes.DATE,
        github_id: DataTypes.BIGINT,
        github_number: DataTypes.INTEGER
    }, {
        indexes: [
            {
                fields: ['content'],
                type: 'FULLTEXT'
            }
        ],
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