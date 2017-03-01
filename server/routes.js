var Static = require('./static');
var Auth = require('./controller/authController');
var Task = require('./controller/taskController');
var Milestone = require('./controller/milestoneController');
var Project = require('./controller/projectController');
var User = require('./controller/userController');
var Notification = require('./controller/notificationController');
var Github = require('./controller/githubController')
var WebHook = require('./controller/webhookController')
var Newsfeed = require('./controller/newsfeedController')
var Message = require('./controller/messageController')

module.exports.endpoints = [
    { method: 'GET',  path: '/{param*}', config: Static.getPublic },
    { method: 'GET',  path: '/images/{filename}', config: Static.images },
    { method: 'GET',  path: '/app/{param*}', config: Static.app },
    { method: 'GET',  path: '/', config: Static.index },

    { method: 'POST',  path: '/login', config: Auth.login },
    { method: 'POST',  path: '/refresh_google_token', config: Auth.refreshGoogleToken },

    { method: 'POST',  path: '/tasks', config: Task.createTask },
    { method: 'GET',  path: '/task/{task_id}', config: Task.getTask },
    { method: 'PUT',  path: '/task/{task_id}', config: Task.updateTask },
    { method: 'POST',  path: '/mark_completed', config: Task.markComplete },
    { method: 'DELETE',  path: '/task/{task_id}', config: Task.removeTask },

    { method: 'POST',  path: '/milestones', config: Milestone.createMilestone },
    { method: 'PUT',  path: '/milestone/{milestone_id}', config: Milestone.updateMilestone },
    { method: 'DELETE',  path: '/milestone/{milestone_id}', config: Milestone.removeMilestone },

    { method: 'POST',  path: '/projects', config: Project.createProject },
    { method: 'POST',  path: '/invite_to_project', config: Project.inviteToProject },
    { method: 'GET',  path: '/project/{project_id}', config: Project.getProject },
    { method: 'GET',  path: '/projects', config: Project.getProjects },
    { method: 'PUT',  path: '/join_project/{project_id}', config: Project.acceptInvitation },
    { method: 'PUT',  path: '/decline_project/{project_id}', config: Project.declineInvitation },
    { method: 'PUT',  path: '/project/{project_id}', config: Project.updateProject },

    { method: 'GET',  path: '/user/populate/{user_id}', config: User.getInfo },
    { method: 'PUT',  path: '/user/{user_id}', config: User.updateInfo },
    { method: 'PUT',  path: '/user/github/{user_id}', config: User.updateGithubLogin },

    { method: 'GET',  path: '/notifications', config: Notification.getNotifications },
    { method: 'DELETE',  path: '/notification/{notification_id}', config: Notification.removeNotification },
    { method: 'PUT',  path: '/notification/{notification_id}', config: Notification.updateNotification },

    { method: 'POST',  path: '/github/oauth/access_token', config: Github.getAccessToken },
    { method: 'POST',  path: '/github/sync/{project_id}', config: Github.sync },

    { method: 'POST',  path: '/webhook/github/setup', config: WebHook.setupGithubWebhook },
    { method: 'POST',  path: '/webhook/github', config: WebHook.githubWebhook },
    { method: 'POST',  path: '/webhook/drive', config: WebHook.googleDriveWebhook },

    { method: 'POST',  path: '/newsfeed/{project_id}', config: Newsfeed.createPost },
    { method: 'GET',  path: '/newsfeed', config: Newsfeed.getNewsfeed },

    { method: 'POST', path: '/messages', config: Message.createMilestoneComment },
];
