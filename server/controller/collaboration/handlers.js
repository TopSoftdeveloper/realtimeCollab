var storage = require('../../data/storage');

var onlineUsers = {}

exports.is_online = function (socket, payload) {
    console.log('User ' + payload.user_id + ' is online');
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
    		}
    	});  	

    });    		    

	console.log(onlineUsers);    
};

exports.is_offline = function(socket) {
	if (onlineUsers[socket.id] === undefined) return;
	console.log('User ' + onlineUsers[socket.id] + ' is offline');

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
		console.log(onlineUsers)
    }); 	
}