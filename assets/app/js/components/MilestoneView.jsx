import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';

import MilestoneModal from './MilestoneModal.jsx'
import MilestoneRow from './MilestoneRow.jsx'
import Remove from './../icons/Remove.jsx'
import AvatarList from './AvatarList.jsx'

class MilestoneView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      AssigneeFilter: null,
      sortByDeadline: true
    }
  }

  handleClose() {
    this.setState({
      isDialogOpen: false
    })
  }

  openModal() {
    this.setState({
      isDialogOpen: true
    })
  }

  addMilestone(content, deadline) {
    this.props.actions.createMilestone({
      id: _.uniqueId('milestone'),
      content: content,
      deadline: deadline,
      project_id: this.props.projectId,
      tasks: []
    })
  }

  editMilestone(milestone_id, content, deadline) {
    this.props.actions.editMilestone(milestone_id, content, deadline)
  }

  deleteMilestone(milestone_id) {
    this.props.actions.deleteMilestone(milestone_id, this.props.projectId)
  }



  render() {
    let rows = [];
    let milestones = this.props.milestones
    if (milestones.length === 0 || (milestones[0].id !== null)) {
      milestones.unshift({  // Just a placeholder milestone for tasks without milestones
        content: 'Default Milestone',
        deadline: null,
        key: 'uncategorized-tasks',
        id: null
      })
    }

    this.props.milestones.forEach(milestone => {
      let onDelete = false
      let onEdit = false
      if (milestone.id) {
        onDelete = this.deleteMilestone.bind(this, milestone.id)
        onEdit = this.editMilestone.bind(this, milestone.id)
      }
      let milestoneView = <MilestoneRow
        milestone={milestone}
        onEditMilestone={onEdit}
        onDeleteMilestone={onDelete}
        location = {this.props.location}
        projectId={this.props.projectId}
        key={milestone.id}
        users={this.props.users}
        actions={this.props.actions}
        tasks ={this.props.tasks.filter(task => task.milestone_id === milestone.id)}
        />
      rows.push(milestoneView)

    }); // milestones.forEach

    let buttonClassName = "add-milestone-btn "

    if (milestones.length === 1 && this.props.tasks.length === 0) {
      buttonClassName += "animated infinite pulse"
      var empty = (
        <div className="no-items todo-empty">
          <h3>Your to-do list is empty!</h3>
          <p>Add something to get started</p>
        </div>
      )
    }

    return (
      <Paper zDepth={0} className='milestone-menu-view'>
        <div>
          <div>
            <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange}>

            </DropDownMenu>
          </div>

          <div class='pull-right'>
            <FlatButton
              key="add-milestone-btn"
              label="Add Milestone"
              className={buttonClassName}
              onTouchTap={this.openModal.bind(this)}
              secondary={true}/>
            <AvatarList
              className="online-users"
              members={this.props.users.filter(user => user.online && !user.me)}
              isSquare={true}
              colour={true}
              />
          </div>
          <MilestoneModal
            key="add-milestone-modal"
            title="Add Milestone"
            open={this.state.isDialogOpen}
            handleClose={this.handleClose.bind(this)}
            method={this.addMilestone.bind(this)}
            />
        </div>
        {rows}
        <div>
          <div className='task-list'>
            {empty}
          </div>
        </div>
      </Paper>
    );
  }
}

export default MilestoneView;
