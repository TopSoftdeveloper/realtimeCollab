// import all models and creates relationships
var constants = require('../../constants');
var Sequelize = require('sequelize');
var config = require('config');
var db_name = config.get('database.name');
var db_username = config.get('database.username');
var db_password = config.get('database.password');
var db_options = config.get('database.options');

var sequelize = new Sequelize(
    db_name,
    db_username,
    db_password,
    db_options
);

var models = [
    constants.TASK_MODEL_NAME
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

module.exports.sequelize = sequelize;