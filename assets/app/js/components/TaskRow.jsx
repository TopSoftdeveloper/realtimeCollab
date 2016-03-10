import React, { Component } from 'react'
import Checkbox from 'material-ui/lib/checkbox';

class TaskRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            hidden: true
        }
    }

    onMouseEnter() {
        this.setState({
            hidden: false
        })  
    }

    onMouseLeave() {
        this.setState({
            hidden: true
        })  
    }

    render() {
        let taskActionClass = "task-actions"
        if (this.state.hidden) {
            taskActionClass = taskActionClass + " invisible"
        }

        return (
        <li className="task-row" onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
            <div className="task-checkbox" onClick={this.props.onCheck}>
                <Checkbox/>
            </div>
            <div className="task-content">
                {this.props.task.content}
            </div>
            <div className={taskActionClass}>
                <i className="material-icons edit-task">mode_edit</i>
                <i className="material-icons delete-task" onClick={this.props.onDelete}>delete</i>
            </div>                            
        </li>
        )
    }
}

export default TaskRow
