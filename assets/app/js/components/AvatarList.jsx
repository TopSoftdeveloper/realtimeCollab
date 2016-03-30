import React, { Component } from 'react'
import {getUserAvatar} from '../utils/general'
import _ from 'lodash'

class AvatarList extends Component {
    constructor(props, context) {
        super(props, context); 
    }    

    render() {
        let avatars = this.props.members.map(member => {
            let colour = this.props.colour ? member.colour : false
            let image = getUserAvatar(member.display_image, member.display_name, true, this.props.isSquare, colour)
            return (
                <li key={_.uniqueId()}>
                    {image}
                </li>)
        });

        let className = this.props.className + " avatar-list-wrapper"
        return (
            <div className={className}>
                <ul className='avatar-list'>{avatars}</ul>
            </div>
        );
    }
}

export default AvatarList