import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import theme from '../myTheme.js';
import * as Actions from '../actions/ReduxTaskActions';
import MilestoneRow from './Milestone/MilestoneRow.jsx';

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sortByDeadlineDescending: true,
    };
    this.toggleSortByDeadline = this.toggleSortByDeadline.bind(this);
  }
  toggleSortByDeadline() {
    this.setState({
      sortByDeadlineDescending: !this.state.sortByDeadlineDescending,
    });
  }
  renderEmptyArea(projectRows) {
    return (projectRows.length === 0 &&
      <div className="no-items todo-empty">
        <h3>Your to-do list is clear!</h3>
      </div>
    );
  }
  render() {
    const {
      users,
      milestones,
      tasks,
      projects,
      dispatch,
    } = this.props;
    const actions = bindActionCreators(Actions, dispatch);
    const editMilestone = (milestoneId, content, deadline) => {
      actions.editMilestone(milestoneId, content, deadline);
    };
    const deleteMilestone = (projectId, milestoneId) => {
      actions.deleteMilestone(milestoneId, projectId);
    };
    // only show task assigned to me and unassigned task
    /* global localStorage */
    const currentUserId = localStorage.getItem('user_id');
    const filterByAssignee = (task) => (
      task.assignee_id === '' || task.assignee_id === null || task.assignee_id === currentUserId
    );
    const milestonesByProject = {};
    const filteredTasks = tasks.filter(filterByAssignee);
    const projectRows = [];
    // group milestone by project
    milestones.forEach(milestone => {
      const projectId = milestone.project_id;
      if (milestonesByProject.projectId) {
        milestonesByProject[projectId] = [milestone, ...milestonesByProject.projectId];
      } else {
        milestonesByProject[projectId] = [milestone];
      }
    });
    Object.keys(milestonesByProject).forEach(projectId => {
      // Just a placeholder milestone for tasks without milestones
      milestonesByProject[projectId].push({
        content: 'Default Milestone',
        deadline: null,
        key: projectId + 'uncategorized-tasks',
        id: null,
      });
    });
    Object.keys(milestonesByProject).forEach(projectId => {
      const milestoneRows = [];
      milestonesByProject[projectId].forEach(milestone => {
        // console.log(milestone)
        let onDelete = null;
        let onEdit = null;
        if (milestone.id) {
          onDelete = deleteMilestone.bind(this, projectId);
          onEdit = editMilestone.bind(this);
        }
        const taskList = filteredTasks.filter(task =>
          task.project_id === projectId && task.milestone_id === milestone.id
        );
        if (taskList.length > 0 || true) {
          const milestoneView = (
            <MilestoneRow
              milestone={milestone}
              onEditMilestone={onEdit}
              onDeleteMilestone={onDelete}
              projectId={projectId}
              key={milestone.id}
              users={users}
              actions={actions}
              tasks={taskList}
            />
          );
          milestoneRows.push(milestoneView);
        }
      });
      const projectName = projects.filter(project => project.id === projectId)[0].content;
      let projectRow = (
        <Paper
          key={projectId}
          zDepth={1}
          className="project-panel milestone-menu-view"
        >
          <h2>{projectName}</h2>
          <div>{milestoneRows}</div>
        </Paper>
      );
      projectRow = (
        <Card
          className="project-panel"
          key={projectId}
          initiallyExpanded
        >
          <CardTitle
            title={projectName}
            showExpandableButton
            style={{ backgroundColor: theme.palette.primary1Color }}
            titleColor={'white'}
            actAsExpander
          />
          <CardText expandable>
            {milestoneRows}
          </CardText>
        </Card>
      );
      if (milestoneRows.length > 0 || true) {
        projectRows.push(projectRow);
      }
    });
    return (
      <Paper zDepth={0} className="main-content">
        <Toolbar>
          <ToolbarGroup firstChild />
          <ToolbarGroup>
            <ToolbarSeparator />
            <FlatButton
              label={this.state.sortByDeadlineDescending ? 'Earliest' : 'Oldest'}
              onTouchTap={this.toggleSortByDeadline}
              primary={false}
            />
          </ToolbarGroup>
        </Toolbar>
        {projectRows}
        <div className="container">
          <div className="task-list">
            {this.renderEmptyArea(projectRows)}
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

const mapStateToProps = (state) => (
  {
    milestones: state.milestones,
    projects: state.projects,
    tasks: state.tasks,
    users: state.users,
  }
);

export default connect(mapStateToProps)(Dashboard);
