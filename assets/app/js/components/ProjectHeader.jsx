import React, { Component } from 'react'
import OnlineUsers from '../components/OnlineUsers.jsx'

class ProjectHeader extends Component {
    constructor(props, context) {
        super(props, context); 
    }    


    render() {
        return (
            <div className='project-header'>
                <span className='project-name'>{this.props.projectName} </span>
                <OnlineUsers members={this.props.members} />
            </div>
        );
    }
}

export default ProjectHeader;