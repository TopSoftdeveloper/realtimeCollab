var storage = require('../../data/storage');

var onlineUsers = {}

function isUserOnline(userId) {
	for (var key in onlineUsers) {
		if (onlineUsers[key] === userId) return true;
	}
	return false;
}

exports.is_online = function (socket, payload) {
    onlineUsers[socket.id] = payload.user_id;

    storage.getProjectsOfUser(payload.user_id).then(function(projects) {
    	// join project room if project has > 1 user
    	projects.forEach(function(project) {
    		if (project.users.length > 1) {

    			socket.join(project.id, function() {
    				// let others in the project know user is online  	
    				socket.to(project.id).emit('teammate_online', {
			    		user_id: payload.user_id
			    	});				    				   			
    			});

				// let user know who is online
		    	project.users.forEach(function(user) {
		    		if (isUserOnline(user.id)) {
	    				socket.emit('teammate_online', {
				    		user_id: user.id
				    	});
		    		}
		    	});	    		

    		}
    	});  	

    });
};

exports.is_offline = function(socket) {
	if (!(socket.id in onlineUsers)) return;
    storage.getProjectsOfUser(onlineUsers[socket.id]).then(function(projects) {
    	projects.forEach(function(project) {
    		if (project.users.length > 1) {
 				// let others in the project know user is offline  	
				socket.to(project.id).emit('teammate_offline', {
		    		user_id: onlineUsers[socket.id]
		    	});		
    		}
    	});  

		delete onlineUsers[socket.id];
    }); 	
}