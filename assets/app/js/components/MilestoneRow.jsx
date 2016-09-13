import React, { Component } from 'react'
import * as SocketActions from '../actions/SocketActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Paper from 'material-ui/lib/paper'
import Divider from 'material-ui/lib/divider'
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'
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




class MilestoneRow extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      milestoneDialog: false,
      showOngoing: true,
      showCompleted:false
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
  deleteMilestone() {
    this.props.onDeleteMilestone()
  }

  openMilestoneModal(id) {
    this.setState({
      milestoneDialog: true
    })
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userIsEditing('milestone', id)
  }

  handleMilestoneClose(id) {
    this.setState({
      milestoneDialog: false
    })
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userStopsEditing('milestone', id)
  }

  editMilestone(content, deadline) {
    this.props.onEditMilestone(content, deadline)
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

  addTask(content, assignee_id) {
    let task = {
      id: _.uniqueId('task'), //temp id
      content: content,
      project_id: this.props.projectId,
      milestone_id: this.props.milestone.id,
      assignee_id: assignee_id
    }
    this.props.actions.addTask(task);
  }


  render() {
    let iconButtonElement = <IconButton><MenuIcon/></IconButton>
    let iconMenu = null
    // ICON MENU
    if (this.props.onDeleteMilestone && this.props.milestone.id) { // Not "Uncategorized"
      iconMenu = <IconMenu
        className='milestone-opt-button'
        iconButtonElement={iconButtonElement}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
        <MenuItem primaryText="Edit Milestone" onClick={this.openMilestoneModal.bind(this, this.props.milestone.id)}/>
        <MenuItem primaryText="Delete Milestone" onClick={this.deleteMilestone.bind(this)}/>
      </IconMenu>
    } else {
      iconMenu = <IconMenu
        className='milestone-opt-button'
        iconButtonElement={iconButtonElement}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
      </IconMenu>
    }

    // DEADLINE
    let deadlineText = null
    if (this.props.milestone.deadline) {
      let eventTime = new Date(this.props.milestone.deadline)
      let options = {year: 'numeric', month: 'long', day: 'numeric' }
      deadlineText = 'Due by ' + eventTime.toLocaleDateString('en-US', options)

    }
    let subtitle = <span className=""><p className='text-muted'>{deadlineText}</p></span>



    // ASSIGNEES
    let possibleAssignees = this.props.users.map(user => {
      return <MenuItem value={user.id} key={user.id} primaryText={user.display_name}/>
    })

    possibleAssignees.unshift(<MenuItem value={0} key={0} primaryText="None"/>)

    // EDITING INDICATOR
    let editIndicator = null
    let listStyle = {margin: 25}

    if (this.props.milestone.editing) {
      let editor = this.props.users.filter(user => user.id === this.props.milestone.edited_by)[0]
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
    let taskList = []

    let ongoingTasks = this.props.tasks.filter(task => !task.completed_on && !task.dirty)
    ongoingTasks.forEach(task => {

      if(this.state.showOngoing) {
        // Only show non-completed tasks and non-dirtied tasks
          let assignees = this.props.users.filter(user => user.id === task.assignee_id)
          let highlightId = this.props.location.query.highlight
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
    let completedTaskList = []
    let completedTasks = this.props.tasks.filter(task => task.completed_on)
    if (this.state.showCompleted && completedTasks.length > 0) {
      taskList.push(
        <CompletedRow
          key={_.uniqueId('completed')}
          completedTasks={completedTasks}
          actions={this.props.actions}
          highlightId={this.props.location.query.highlight}
          />)
    }

    let ongoingText =  ongoingTasks.length + ' Ongoing'
    let completedTask = completedTasks.length + ' Completed '
      return (
        <Paper  zDepth={0} style={listStyle}>
          <div className="milestone-row">
          {editIndicator}
          <Divider/>
          <div className="milestone-row-header">
            <Grid fluid={true}>
              <Row>
                <Col xs={10}>
                  <div className="milestone-title">
                    {this.props.milestone.content}

                    <FlatButton label={ongoingText} primary={true} onTouchTap={this.toggleOngoing.bind(this)}/>
                    <FlatButton label={completedTask} secondary={true} onTouchTap={this.toggleCompleted.bind(this)}/>
                  </div>
                  <smaill>{subtitle}</smaill>

                </Col>
                <Col xs={2}>

                  <div className="pull-right">
                    {iconMenu}
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
              taskMethod={this.addTask.bind(this)}
              users={this.props.users}
              />
            <MilestoneModal
              title="Edit Milestone"
              open={this.state.milestoneDialog}
              handleClose={this.handleMilestoneClose.bind(this, this.props.milestone.id)}
              method={this.editMilestone.bind(this)}
              deadline={this.props.milestone.deadline}
              content={this.props.milestone.content}
              />
          </div>
        </Paper>


      );
    }
  }

  export default connect()(MilestoneRow)
