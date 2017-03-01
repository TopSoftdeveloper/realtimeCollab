var constants = require('../../constants');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(constants.MILESTONE_COMMENT_MODEL_NAME, {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    content: DataTypes.TEXT,
    author_id: DataTypes.STRING,
    pinned: DataTypes.BOOLEAN,
  }, {
    underscored: true,
    classMethods: {
      isExist: function (id) {
        return this.findById(id).then(function (instance) {
          return instance !== null;
        });
      },
      getComment: function(id) {
        return this.findById(id);
      },
    },
  });
};
