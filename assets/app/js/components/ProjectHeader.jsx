import React, { Component } from 'react'

class ProjectHeader extends Component {
    constructor(props, context) {
        super(props, context); 
    }    


    render() {

        return (
            <div className='task-table-header'>
                <span className='project-name'>{this.props.projectName} </span>
            </div>
        );
    }
}

export default ProjectHeader;