import React, { Component } from 'react'
import _ from 'lodash'

class OnlineUsers extends Component {
    constructor(props, context) {
        super(props, context); 
    }    

    render() {
        let onlineUsers = [];
        this.props.members.forEach(member => {
            if (member.online && member.id !== sessionStorage.getItem('user_id')) {
                onlineUsers.push(<li key={_.uniqueId('online')}>{member.display_name}</li>);
            }                        
        });
        return (
            <ul className='online-users'>{onlineUsers}</ul>
        );
    }
}

export default OnlineUsers;