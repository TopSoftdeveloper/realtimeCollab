import React, { Component } from 'react'
import {getUserAvatar} from '../utils/general'
import _ from 'lodash'

class OnlineUsers extends Component {
    constructor(props, context) {
        super(props, context); 
    }    

    render() {
        let onlineUsers = [];
        this.props.members.forEach(member => {
            if (member.online && member.id !== localStorage.getItem('user_id')) {
                let image = getUserAvatar(member.display_image, member.display_name, true)
                onlineUsers.push(
                    <li key={_.uniqueId('online')}>
                        {image}
                    </li>);
            }                        
        });
        return (
            <ul className='online-users'>{onlineUsers}</ul>
        );
    }
}

export default OnlineUsers;