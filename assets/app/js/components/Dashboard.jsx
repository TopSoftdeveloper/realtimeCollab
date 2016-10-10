import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import _ from 'lodash'
import $ from 'jquery'


import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item'
import ClearIcon from 'material-ui/lib/svg-icons/content/clear'
import {Alert, Tooltip, OverlayTrigger} from 'react-bootstrap'

import MilestoneModal from './MilestoneModal.jsx'
import MilestoneRow from './MilestoneRow.jsx'
import AssigneeRow from './AssigneeRow.jsx'
import Remove from './../icons/Remove.jsx'
import AvatarList from './AvatarList.jsx'




class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      assigneeFilter: 'all',
      sortByDeadlineDescending: true,
      showResetButton: false,
      isFilterApplied: false,
      // viewBy: 'assignee'
      viewBy: 'milestone'

    }
  }
  changeViewMode(mode) {
    this.setState({
      viewBy: mode
    })
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


  applyAssigneeFilter(event, index, value) {
    this.setState({
      assigneeFilter: value,
      showResetButton:true,
      isFilterApplied: true,
    })
  }
  toggleSortByDeadline() {
    this.setState({
      sortByDeadlineDescending: !this.state.sortByDeadlineDescending,
      showResetButton:true
    })
  }
  clearFilterAndSort() {
    this.setState({
      showResetButton:false,
      assigneeFilter: 'all',
      sortByDeadlineDescending: true,
      isFilterApplied: false,
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

        // deadline sorting function
        // milestones without a deadline should be always be put in bottom
        const sortByDeadline = (milestoneA, milestoneB) => {
          let deadlineA = milestoneA.deadline
          let deadlineB = milestoneB.deadline
          let scala = this.state.sortByDeadlineDescending?1:-1
          if (deadlineA != null) {
            deadlineA = new Date(deadlineA).getTime() * scala
          } else {
            deadlineA = Number.MAX_VALUE
          }
          if (deadlineB != null) {
            deadlineB = new Date(deadlineB).getTime() * scala
          } else {
            deadlineB = Number.MAX_VALUE
          }
          let result = deadlineA - deadlineB
          return result
        }

        let milestoneRows = [];
        let milestones = this.props.milestones
        if (milestones.length === 0 || (milestones[0].id !== null)) {
          milestones.unshift({  // Just a placeholder milestone for tasks without milestones
            content: 'Default Milestone',
            deadline: null,
            key: 'uncategorized-tasks',
            id: null
          })
        }
        let tasks = this.props.tasks
        if (this.state.isFilterApplied) {
          tasks = tasks.filter(filterByAssignee)
        }
        milestones.sort(sortByDeadline).forEach(milestone => {
          // console.log(milestone)
          let onDelete = false
          let onEdit = false
          if (milestone.id) {
            onDelete = this.deleteMilestone.bind(this, milestone.id)
            onEdit = this.editMilestone.bind(this, milestone.id)
          }
          let taskList = tasks.filter(task => task.milestone_id === milestone.id)
          if(taskList.length>0 || !this.state.isFilterApplied) {
            let milestoneView = <MilestoneRow
              milestone={milestone}
              onEditMilestone={onEdit}
              onDeleteMilestone={onDelete}
              location = {this.props.location}
              projectId={this.props.projectId}
              key={milestone.id}
              users={this.props.users}
              actions={this.props.actions}
              tasks ={taskList}
              />
            milestoneRows.push(milestoneView)
          }


        }); // milestones.forEach

        let buttonClassName = "add-milestone-btn"
        if (milestones.length === 1 && this.props.tasks.length === 0) {
          buttonClassName += "animated infinite pulse"
          var empty = (
            <div className="no-items todo-empty">
              <h3>Your to-do list is clear!</h3>
            </div>
          )
        }



        let resetButton = null
        if (this.state.showResetButton) {
          resetButton =
          <FlatButton
            label="Clear all filters and sorts"
            onTouchTap={this.clearFilterAndSort.bind(this)}
            hoverColor='transparent'
            primary={false}
            icon={<ClearIcon/>}
            />
        }

        let assigneeFilterTooltip = <Tooltip id="assignee">filter by asssignees</Tooltip>
        let sortByDeadlineTooltip = <Tooltip id="deadline">sort by deadline</Tooltip>
        return (
          <Paper zDepth={0} className='milestone-menu-view'>
            <Toolbar>
              <ToolbarGroup firstChild={true} float="left">


              </ToolbarGroup>
              <ToolbarGroup float="right">
                <ToolbarSeparator />
                  <FlatButton
                    label={this.state.sortByDeadlineDescending?'Earliest':'Oldest'}
                    onTouchTap={this.toggleSortByDeadline.bind(this)}
                    primary={false}
                    />

              </ToolbarGroup>

              <MilestoneModal
                key="add-milestone-modal"
                title="Add Milestone"
                open={this.state.isDialogOpen}
                handleClose={this.handleClose.bind(this)}
                method={this.addMilestone.bind(this)}
                />
            </Toolbar>

            {milestoneRows}
            <div className='container'>
              <div className='task-list'>
                {empty}
              </div>
            </div>
          </Paper>
        );

    }
  }

  Dashboard.propTypes = {
      dispatch: PropTypes.func.isRequired,
      alerts: PropTypes.object.isRequired,
      app: PropTypes.object.isRequired,
      milestones: PropTypes.array.isRequired,
      projects: PropTypes.array.isRequired,
      tasks: PropTypes.array.isRequired,
      users: PropTypes.array.isRequired,
      files: PropTypes.array.isRequired,
      newsfeed: PropTypes.array.isRequired
  };

  const mapStateToProps = (state) => {
      return {
          alerts: state.alerts,
          app: state.app,
          milestones: state.milestones,
          projects: state.projects,
          tasks: state.tasks,
          users: state.users,
          files: state.files,
          githubRepos: state.githubRepos,
          newsfeed: state.newsfeed
      };
  }

  export default connect(mapStateToProps)(Dashboard)
