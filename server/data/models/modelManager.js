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

var modelFiles = [
    'Milestone',
    'Task'
];

modelFiles.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
    m.Task.belongsTo(m.Milestone);
    m.Milestone.hasMany(m.Task);
})(module.exports);

sequelize.sync().then(function() {
    console.log('tables created');
},function(error) {
    console.log(error);
});

module.exports.sequelize = sequelize;