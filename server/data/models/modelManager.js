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
    'Task',
    'User',
    'Project',
    'UserProject'
];

modelFiles.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
    m.Task.belongsTo(m.Milestone);

    m.Milestone.belongsTo(m.Project);
    m.Milestone.hasMany(m.Task);

    m.Project.belongsToMany(m.User, {through: m.UserProject});
    m.Project.hasMany(m.Milestone);

    m.User.belongsToMany(m.Project, {through: m.UserProject});
})(module.exports);

sequelize.sync().then(function() {
},function(error) {
    console.log(error);
});

module.exports.sequelize = sequelize;