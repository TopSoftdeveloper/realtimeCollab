var Static = require('./static');
var Auth = require('./controller/authController');
var Task = require('./controller/taskController');
var Milestone = require('./controller/milestoneController');
var Project = require('./controller/projectController');
var User = require('./controller/userController');

module.exports.endpoints = [
    { method: 'GET',  path: '/{param*}', config: Static.getPublic },
    { method: 'GET',  path: '/app/{param*}', config: Static.app },
    { method: 'GET',  path: '/', config: Static.index },

    { method: 'POST',  path: '/create_account', config: Auth.createAccount },
    { method: 'POST',  path: '/login', config: Auth.login },

    { method: 'POST',  path: '/create_task', config: Task.createTask },
    { method: 'GET',  path: '/task', config: Task.getTask },
    { method: 'POST',  path: '/mark_completed', config: Task.markComplete },
    { method: 'DELETE',  path: '/delete_task', config: Task.removeTask },

    { method: 'POST',  path: '/create_milestone', config: Milestone.createMilestone },
    { method: 'GET',  path: '/milestone/{project_id}', config: Milestone.getMilestone },
    { method: 'DELETE',  path: '/delete_milestone', config: Milestone.removeMilestone },

    { method: 'POST',  path: '/create_project', config: Project.createProject },
    { method: 'POST',  path: '/invite_to_project', config: Project.inviteToProject },
    { method: 'GET',  path: '/project/{user_id}', config: Project.getProjects },

    { method: 'GET',  path: '/user/populate/{user_id}', config: User.getInfo }
];
