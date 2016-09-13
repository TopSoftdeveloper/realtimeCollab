import React, { Component } from 'react'
import Checkbox from 'material-ui/lib/checkbox'
import AvatarList from './AvatarList.jsx'
import Divider from 'material-ui/lib/divider';
import TaskModal from './TaskModal.jsx'
import { bindActionCreators } from 'redux'
import * as SocketActions from '../actions/SocketActions'
import { connect } from 'react-redux'

class TaskRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            hidden: true,
            isDialogOpen: false
        }
    }

    openModal(id) {
        this.setState({
            isDialogOpen: true
        })
        const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
        socketActions.userIsEditing('task', id)
    }

    handleClose(id) {
        this.setState({
            isDialogOpen: false
        })
        const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
        socketActions.userStopsEditing('task', id)
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

        // EDITING INDICATOR
        let editIndicator = null
        let listStyle = {}

        if (this.props.task.editing) {
            let editor = this.props.users.filter(user => user.id === this.props.task.edited_by)[0]
            if (editor && editor.online) {
                let divStyle = {
                    float: 'right',
                    fontSize: 'smaller',
                    color: 'white',
                    background: editor.colour,
                    fontWeight: 'bold'
                }

                editIndicator =
                    <div style={divStyle}>{editor.display_name} is editing</div>
                listStyle = {
                    borderStyle: 'solid',
                    borderColor: editor.colour
                }
            }
        }

        return (
        <div>
        <div className="task-row"
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            style={listStyle}>
            <div className="task-checkbox" onClick={this.props.onCheck}>
                <Checkbox/>
            </div>
            <div className={taskContentClass}>
                {this.props.task.content}
            </div>
            <div className={taskActionClass}>
                <i className="material-icons edit-task" onClick={this.openModal.bind(this, this.props.task.id)}>mode_edit</i>
                <i className="material-icons delete-task" onClick={this.props.onDelete}>delete</i>
            </div>
            <AvatarList className="assignee-avatar" members={this.props.assignees} />
            {editIndicator}

            <TaskModal
                title="Edit Task"
                content={this.props.task.content}
                assignee={this.props.task.assignee_id}
                open={this.state.isDialogOpen}
                handleClose={this.handleClose.bind(this, this.props.task.id)}
                taskMethod={this.onEdit.bind(this)}
                users={this.props.users}
            />
        </div>
        </div>
        )
    }
}
export default connect()(TaskRow)
