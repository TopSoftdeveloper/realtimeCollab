import React, { Component,PropTypes } from 'react'
import * as SocketActions from '../actions/SocketActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Paper from 'material-ui/lib/paper'
import Divider from 'material-ui/lib/divider'
import AddIcon from 'material-ui/lib/svg-icons/content/add'
import Dialog from 'material-ui/lib/dialog';
import { IconButton, IconMenu, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/select-field';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import {Button, Grid, Row, Col} from 'react-bootstrap'

import TaskRow from './TaskRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import TaskModal from './TaskModal.jsx'
import MilestoneModal from './MilestoneModal.jsx'

class AssigneeRow extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      showOngoing: true,
      showCompleted:false,
    }
  }

  toggleOngoing() {
    this.setState({
      showOngoing: !this.state.showOngoing
    })
  }
  toggleCompleted() {
    this.setState({
      showCompleted: !this.state.showCompleted
    })
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
  addTask(content, assignee_id) {
    let task = {
      id: _.uniqueId('task'), //temp id
      content: content,
      project_id: this.props.projectId,
      milestone_id: null,
      assignee_id: assignee_id
    }
    this.props.actions.addTask(task);
  }
  deleteTask(task_id) {
    this.props.actions.deleteTask(task_id, this.props.projectId)
  }
  markDone(task_id) {
    this.props.actions.markDone(task_id, this.props.projectId)
  }
  editTask(task_id, content, assignee) {
    this.props.actions.editTask(task_id, content, assignee)
  }


  render() {
    let taskList = []
    let ongoingTasks = this.props.tasks.filter(task => !task.completed_on && !task.dirty)
    ongoingTasks.forEach(task => {
      if(this.state.showOngoing) {
        // Only show non-completed tasks and non-dirtied tasks
        let assignees = this.props.users.filter(user => user.id === task.assignee_id)
        let highlightId = this.context.location.query.highlight
        let highlight = false
        if (highlightId === task.id) {
          highlight = true
        }
        taskList.push(
          <TaskRow
            key={_.uniqueId('task')}
            task={task}
            assignees={assignees}
            onCheck={this.markDone.bind(this, task.id)}
            onEdit={this.editTask.bind(this, task.id)}
            onDelete={this.deleteTask.bind(this, task.id)}
            users={this.props.users}
            highlight={highlight}/>
        )
      }

    }) // task forEach
    let completedTasks = this.props.tasks.filter(task => task.completed_on)
    if (this.state.showCompleted && completedTasks.length > 0) {
      taskList.push(
        <CompletedRow
          key={_.uniqueId('completed')}
          completedTasks={completedTasks}
          actions={this.props.actions}
          highlightId={this.context.location.query.highlight}
          />)
        }

        let ongoingText =  ongoingTasks.length + ' Ongoing'
        let completedTask = completedTasks.length + ' Completed '
        let ongoingLabelStyle = {
          opacity: this.state.showOngoing ? 1 : 0.5,
        }
        let completedLabelStyle = {
          opacity: this.state.showCompleted ? 1 : 0.5,
        }
        let milestoneInfo =
        <div className="milestone-row-info">
          <FlatButton labelStyle={ongoingLabelStyle} label={ongoingText} primary={true} onTouchTap={this.toggleOngoing.bind(this)}/>
          <FlatButton labelStyle={completedLabelStyle} label={completedTask} secondary={true} onTouchTap={this.toggleCompleted.bind(this)}/>
        </div>

        return (
          <Paper zDepth={0}>
            <Grid fluid={true}>
              <div className="milestone-row">
                <Divider/>
                <div className="milestone-row-header">
                  <Grid fluid={true}>
                    <Row>
                      <Col xs={10}>
                        <div className="milestone-title">
                          {this.props.user.display_name}
                          {milestoneInfo}
                        </div>
                      </Col>
                      <Col xs={2}>

                        <div className="pull-right">
                          <IconButton
                            tooltip="new task"
                            tooltipPosition="top-right"
                            onClick={this.openModal.bind(this)}
                            ><AddIcon/></IconButton>
                        </div>
                      </Col>
                    </Row>
                  </Grid>
                </div>

                <div>
                  {taskList}
                </div>
                <TaskModal
                  title="Add Task"
                  open={this.state.isDialogOpen}
                  handleClose={this.handleClose.bind(this)}
                  assignee={this.props.user.id}
                  taskMethod={this.addTask.bind(this)}
                  users={this.props.users}
                  />
              </div>
            </Grid >
          </Paper>


        );
      }
    }
    AssigneeRow.defaultProps = {
      key: _.uniqueId('AssigneeRow')
    };
    AssigneeRow.proptypes = {
      projectId: PropTypes.string.isRequired,
      key: PropTypes.string,
      user: PropTypes.object.isRequired,
      users: PropTypes.array.isRequired,
      actions: PropTypes.object.isRequired,
      tasks: PropTypes.array.isRequired,
    }
    AssigneeRow.contextTypes = {
      location: React.PropTypes.object
    }

    export default connect()(AssigneeRow)
