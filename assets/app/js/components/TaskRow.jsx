import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import * as SocketActions from '../actions/SocketActions'
import { connect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import Checkbox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider';

import AvatarList from './AvatarList.jsx'
import TaskModal from './TaskModal.jsx'



class TaskRow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            hidden: true,
            isDialogOpen: false
        }
    }
    onEdit(content, assignee_id) {
        this.props.onEdit(content, assignee_id)
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

    render() {
        //
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

        <div className="task-row"
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            style={listStyle}>
            <Grid fluid={true}>
            <Row>
              <Col xs={1}>
                <div className='task-checkbox'>
                  <Checkbox onClick={this.props.onCheck}/>
                </div>
              </Col>
              <Col xs={10}>
              <div className={taskContentClass}>
                  {this.props.task.content}
                <div className={taskActionClass}>
                  <i className="material-icons edit-task" onClick={this.openModal.bind(this, this.props.task.id)}>mode_edit</i>
                  <i className="material-icons delete-task" onClick={this.props.onDelete}>delete</i>
                </div>
              </div>
              </Col>
              <Col xs={1}>
              <AvatarList className="assignee-avatar" members={this.props.assignees} />
              {editIndicator}
              </Col>

            </Row>
            </Grid>
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
        )
    }
}
export default connect()(TaskRow)
