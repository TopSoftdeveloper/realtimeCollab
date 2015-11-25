import React, { Component, PropTypes } from 'react'

class TaskPanelHeader extends Component {
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

export default TaskPanelHeader;