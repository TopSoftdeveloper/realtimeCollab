import React, { Component } from 'react'
import Checkbox from 'material-ui/lib/checkbox'
import AvatarList from './AvatarList.jsx'
import Divider from 'material-ui/lib/divider';
import TaskModal from './TaskModal.jsx'

class TaskRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            hidden: true,
            isDialogOpen: false
        }
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    handleClose() {
        this.setState({
            isDialogOpen: false
        })
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

    onEdit(content, assignee_id) {
        this.props.onEdit(content, assignee_id)
    }

    render() {
        let taskActionClass = "task-actions"
        let taskContentClass = "task-content"
        if (this.state.hidden) {
            taskActionClass = taskActionClass + " invisible"
        }
        if (this.props.highlight) {
            taskContentClass = taskContentClass + " highlight-yellow"
        }

        return (
        <li className="task-row" onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
            <div className="task-checkbox" onClick={this.props.onCheck}>
                <Checkbox/>
            </div>
            <div className={taskContentClass}>
                {this.props.task.content}
            </div>
            <div className={taskActionClass}>
                <i className="material-icons edit-task" onClick={this.openModal.bind(this)}>mode_edit</i>
            </div>
            <AvatarList className="assignee-avatar" members={this.props.assignees} />
            <Divider />
            <TaskModal
                title="Edit Task"
                content={this.props.task.content}
                assignee={this.props.task.assignee_id}
                open={this.state.isDialogOpen}
                handleClose={this.handleClose.bind(this)}
                taskMethod={this.onEdit.bind(this)}
                users={this.props.users}
            />
        </li>
        )
    }
}

export default TaskRow
