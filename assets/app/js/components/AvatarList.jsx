import React, { Component } from 'react'
import {getUserAvatar} from '../utils/general'
import _ from 'lodash'

class AvatarList extends Component {
    constructor(props, context) {
        super(props, context); 
    }    

    render() {
        let avatars = this.props.members.map(member => {
            let image = getUserAvatar(member.display_image, member.display_name, true)
            return (
                <li key={_.uniqueId('online')}>
                    {image}
                </li>)
        });
        return (
            <div className={this.props.className}>
                <ul className='avatar-list'>{avatars}</ul>
            </div>
        );
    }
}

export default AvatarList