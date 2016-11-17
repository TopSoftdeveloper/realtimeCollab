import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/ReduxTaskActions';
import _ from 'lodash'
import $ from 'jquery'

import theme from '../myTheme.js'

import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';

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



class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sortByDeadlineDescending: true,
    }
  }

  toggleSortByDeadline() {
    this.setState({
      sortByDeadlineDescending: !this.state.sortByDeadlineDescending
    })
  };


  render() {
    console.log('Dashboard::render()')
    const {
      users,
      milestones,
      tasks,
      projects,
      dispatch
    } = this.props
    const actions = bindActionCreators(Actions, dispatch)
    const editMilestone = (milestone_id, content, deadline) => {actions.editMilestone(milestone_id, content, deadline)}
    const deleteMilestone= (milestone_id, projectId) => {actions.deleteMilestone(milestone_id, projectId)}
    // only show task assigned to me and unassigned task
    const currentUserId = localStorage.getItem('user_id')
    const filterByAssignee = (task) => (task.assignee_id === '' || task.assignee_id === null || task.assignee_id === currentUserId)

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

    let milestonesByProject = {}
    let filteredTasks = tasks.filter(filterByAssignee)
    let projectRows = []

    // group milestone by project
    milestones.forEach(milestone => {
      let projectId = milestone.project_id
      if(milestonesByProject.projectId) {
        milestonesByProject[projectId] = [milestone, ...milestonesByProject.projectId]
      } else {
        milestonesByProject[projectId] = [milestone]
      }
    })

    Object.keys(milestonesByProject).forEach(projectId=> {
      milestonesByProject[projectId].push({  // Just a placeholder milestone for tasks without milestones
        content: 'Default Milestone',
        deadline: null,
        key: projectId+'uncategorized-tasks',
        id: null
      })

    })
    Object.keys(milestonesByProject).forEach(projectId=> {
      let milestoneRows = []
      milestonesByProject[projectId].forEach(milestone=>{
        // console.log(milestone)
        let onDelete = false
        let onEdit = false
        if (milestone.id) {
          onDelete = deleteMilestone.bind(this, milestone.id, projectId)
          onEdit = editMilestone.bind(this, milestone.id)
        }
        let taskList = filteredTasks.filter(task => task.project_id === projectId && task.milestone_id === milestone.id)

        if(taskList.length>0 || true) {
          let milestoneView = <MilestoneRow
            milestone={milestone}
            onEditMilestone={onEdit}
            onDeleteMilestone={onDelete}
            projectId={projectId}
            key={milestone.id}
            users={users}
            actions={actions}
            tasks ={taskList}
            />
          milestoneRows.push(milestoneView)
        }
      })
      let projectName = projects.filter(project=>project.id===projectId)[0].content
      let projectRow = (
        <Paper key={projectId} zDepth={1} className='project-panel milestone-menu-view'>
          <h2>{projectName}</h2>
          <div>{milestoneRows}</div>
        </Paper>)
      projectRow = (
        <Card
          className ='project-panel'
          key={projectId}
          initiallyExpanded = {true}

        >
         <CardTitle
           title={projectName}
           showExpandableButton = {true}
           style = {{'backgroundColor':theme.palette.primary1Color}}
           titleColor={'white'}
           actAsExpander = {true}/>
          <CardText expandable={true}>
            {milestoneRows}
          </CardText>
        </Card>
      )

        if(milestoneRows.length>0 || true) {
          projectRows.push(projectRow)
        }

      })

      if (projectRows.length === 0) {
        var empty = (
          <div className="no-items todo-empty">
            <h3>Your to-do list is clear!</h3>
          </div>
        )
      }

      return (
        <Paper zDepth={0} className='main-content'>
          <Toolbar
            >
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
          </Toolbar>

          {projectRows}
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
    milestones: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  };

  const mapStateToProps = (state) => {
    return {
      milestones: state.milestones,
      projects: state.projects,
      tasks: state.tasks,
      users: state.users,
    };
  }

  export default connect(mapStateToProps)(Dashboard)
