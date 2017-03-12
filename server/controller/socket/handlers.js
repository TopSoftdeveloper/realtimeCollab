var storage = require('../../data/storage')
var io = require('./index');
var onlineUsers = {}
var sockets = {}

function getUserOfSocketId(socketId) {
	for (var key in onlineUsers) {
		if (onlineUsers.hasOwnProperty(key)) {
			if (onlineUsers[key] === socketId) return key
		}
	}
	return false
}

exports.sendMessageToUser = function(userId, type, payload) {
	if (!onlineUsers[userId]) {
		return false
	}
	sockets[onlineUsers[userId]].emit(type, payload)
	return true
}


exports.sendAddDiscussionMessageToProject = function(projectId, payload) {
	io.io.in(projectId).emit('add_discussion_Message', payload);
};


exports.sendMessageToProject = function(projectId, type, payload) {
	io.io.in(projectId).emit(type, payload)
}
exports.is_online = function (socket, payload) {
    onlineUsers[payload.user_id] = socket.id;
	sockets[socket.id] = socket;

    storage.getProjectsOfUser(payload.user_id).then(function(projects) {
    	// join project room if project has > 1 user
    	projects.forEach(function(project) {
				socket.join(project.id, function() {
					// let others in the project know user is online
					socket.to(project.id).emit('teammate_online', {
						user_id: payload.user_id
					});
				});

				project.users.forEach(function(user) {
				// let user know who is online
					if (onlineUsers[user.id]) {
						socket.emit('teammate_online', {
							user_id: user.id
						});
					}
				});
    	});

    });
};

exports.is_offline = function(socket) {
	var userId = getUserOfSocketId(socket.id)
	if (!userId) return

    storage.getProjectsOfUser(userId).then(function(projects) {
    	projects.forEach(function(project) {
    		if (project.users.length > 1) {
 				// let others in the project know user is offline
				socket.to(project.id).emit('teammate_offline', {
		    		user_id: userId
		    	})
    		}
    	})

		delete onlineUsers[userId]
		delete sockets[socket.id]
    })
}

exports.editing_status = function(socket, eventName, payload) {
	if (payload.type === 'task') {
		storage.findProjectOfTask(payload.id).then(function(result) {
			if (result) {
				socket.to(result.project.id).emit(eventName, payload);
			}
		})
	} else if (payload.type === 'milestone') {
		storage.findProjectOfMilestone(payload.id).then(function(result) {
			if (result) {
				socket.to(result.project.id).emit(eventName, payload);
			}
		})
	}
}
