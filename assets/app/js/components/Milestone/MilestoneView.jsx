import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import MilestoneModal from './MilestoneModal.jsx';
import MilestoneRow from './MilestoneRow.jsx';
import AssigneeRow from './AssigneeRow.jsx';
import AvatarList from '../Common/AvatarList.jsx';

const propTypes = {
  // props passed by parents
  projectId: PropTypes.string,
  // props passed by container
  milestones: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};
class MilestoneView extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      isDialogOpen: false,
      assigneeFilter: 'all',
      sortByDeadlineDescending: true,
      showResetButton: false,
      isFilterApplied: false,
      viewBy: 'milestone',
    };
  }
  changeViewMode(mode) {
    this.setState({
      viewBy: mode,
    });
  }
  handleClose() {
    this.setState({
      isDialogOpen: false,
    });
  }

  openModal() {
    this.setState({
      isDialogOpen: true,
    });
  }


  applyAssigneeFilter(event, index, value) {
    this.setState({
      assigneeFilter: value,
      showResetButton: true,
      isFilterApplied: true,
    });
  }
  toggleSortByDeadline() {
    this.setState({
      sortByDeadlineDescending: !this.state.sortByDeadlineDescending,
      showResetButton: true,
    });
  }
  clearFilterAndSort() {
    this.setState({
      showResetButton: false,
      assigneeFilter: 'all',
      sortByDeadlineDescending: true,
      isFilterApplied: false,
    });
  }

  addMilestone(content, deadline) {
    this.props.actions.createMilestone({
      id: _.uniqueId('milestone'),
      content,
      deadline,
      project_id: this.props.projectId,
      tasks: [],
    });
  }
  editMilestone(milestoneId, content, deadline) {
    this.props.actions.editMilestone(milestoneId, content, deadline);
  }

  deleteMilestone(milestoneId) {
    this.props.actions.deleteMilestone(milestoneId, this.props.projectId);
  }

  render() {
    // condition for assignee mode
    if (this.state.viewBy === 'assignee') {
      const users = this.props.users;
      const assigneeRows = [];
      // console.log(users)
      users.forEach(user => {
        const taskList = this.props.tasks.filter(task => task.assignee_id === user.id);
        const assigneeRow = (
          <AssigneeRow
            projectId={this.props.projectId}
            key={user.id}
            user={user}
            users={users}
            actions={this.props.actions}
            tasks={taskList}
          />
        );
        assigneeRows.push(assigneeRow);
      });
      const nonUser = {
        id: null,
        display_name: 'None',
        display_image: null,
      };
      const taskList = this.props.tasks.filter(task => (
        !task.assignee_id || task.assignee_id === nonUser.id)
      );
      assigneeRows.unshift(
        <AssigneeRow
          projectId={this.props.projectId}
          key={nonUser.id}
          user={nonUser}
          users={users}
          actions={this.props.actions}
          tasks={taskList}
        />
      );
      return (
        <Paper zDepth={0} className="milestone-menu-view">
          <Toolbar>
            <ToolbarGroup firstChild>
              <AvatarList
                className="milestone-online-users"
                members={this.props.users.filter(user => user.online && !user.me)}
                isSquare
                colour
              />
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarSeparator />
              <RaisedButton
                key="switch-milestone-mode-btn"
                label="View by milestone"
                onTouchTap={this.changeViewMode.bind(this, 'milestone')}
                secondary
              />
            </ToolbarGroup>
          </Toolbar>
          {assigneeRows}
        </Paper>
      );
    }
    const filterByAssignee = task =>
    (this.state.assigneeFilter === 'all' || task.assignee_id === this.state.assigneeFilter);
    // deadline sorting function
    // milestones without a deadline should be always be put in bottom
    const sortByDeadline = (milestoneA, milestoneB) => {
      let deadlineA = milestoneA.deadline;
      let deadlineB = milestoneB.deadline;
      const scala = this.state.sortByDeadlineDescending ? 1 : -1;
      if (deadlineA != null) {
        deadlineA = new Date(deadlineA).getTime() * scala;
      } else {
        deadlineA = Number.MAX_VALUE;
      }
      if (deadlineB != null) {
        deadlineB = new Date(deadlineB).getTime() * scala;
      } else {
        deadlineB = Number.MAX_VALUE;
      }
      const result = deadlineA - deadlineB;
      return result;
    };

    const milestoneRows = [];
    const milestones = [...this.props.milestones];
    if (milestones.length === 0 || (milestones[0].id !== null)) {
      milestones.unshift({  // Just a placeholder milestone for tasks without milestones
        content: 'Default Milestone',
        deadline: null,
        key: 'uncategorized-tasks',
        id: null,
      });
    }
    let tasks = this.props.tasks;
    if (this.state.isFilterApplied) {
      tasks = tasks.filter(filterByAssignee);
    }
    milestones.sort(sortByDeadline).forEach(milestone => {
      // console.log(milestone)
      let onDelete = false;
      let onEdit = false;
      if (milestone.id) {
        onDelete = this.deleteMilestone.bind(this, milestone.id);
        onEdit = this.editMilestone.bind(this, milestone.id);
      }
      const taskList = tasks.filter(task => task.milestone_id === milestone.id);
      if (taskList.length > 0 || !this.state.isFilterApplied) {
        const milestoneView = (
          <MilestoneRow
            milestone={milestone}
            onEditMilestone={onEdit}
            onDeleteMilestone={onDelete}
            projectId={this.props.projectId}
            key={milestone.id}
            users={this.props.users}
            actions={this.props.actions}
            tasks={taskList}
          />
        );
        milestoneRows.push(milestoneView);
      }
    }); // milestones.forEach
    let buttonClassName = 'add-milestone-btn';
    if (milestones.length === 1 && this.props.tasks.length === 0) {
      buttonClassName += 'animated infinite pulse';
      const empty = (
        <div className="no-items todo-empty">
          <h3>Your to-do list is empty!</h3>
          <p>Add something to get started</p>
        </div>
      );
    }
    const AssignesMenuItems = this.props.users.map(user => (
      <MenuItem value={user.id} key={user.id} primaryText={user.display_name} />
    ));
    AssignesMenuItems.unshift(<MenuItem value={null} key={''} primaryText="None" />);
    AssignesMenuItems.unshift(<MenuItem value={'all'} key={'all'} primaryText="All" />);
    let resetButton = null;
    if (this.state.showResetButton) {
      resetButton = (
        <FlatButton
          label="Clear all filters and sorts"
          onTouchTap={this.clearFilterAndSort.bind(this)}
          hoverColor="transparent"
          primary={false}
          icon={<ClearIcon />}
        />
      );
    }
    const assigneeFilterTooltip = <Tooltip id="assignee">filter by asssignees</Tooltip>;
    const sortByDeadlineTooltip = <Tooltip id="deadline">sort by deadline</Tooltip>;
    return (
      <Paper zDepth={1} className="milestone-menu-view">
        <div>{resetButton}</div>
        <Toolbar>
          <ToolbarGroup firstChild>
            <OverlayTrigger placement="bottom" overlay={assigneeFilterTooltip}>
              <DropDownMenu
                maxHeight={300}
                value={this.state.assigneeFilter}
                onChange={this.applyAssigneeFilter.bind(this)}
              >
                {AssignesMenuItems}
              </DropDownMenu>
            </OverlayTrigger>
            <AvatarList
              className="milestone-online-users"
              members={this.props.users.filter(user => user.online && !user.me)}
              isSquare
              colour
            />
          </ToolbarGroup>
          <ToolbarGroup>

            <FlatButton
              label={this.state.sortByDeadlineDescending ? 'Earliest' : 'Oldest'}
              onTouchTap={this.toggleSortByDeadline.bind(this)}
              primary={false}
            />
            <RaisedButton
              key="add-milestone-btn"
              label="Add Milestone"
              className={buttonClassName}
              onTouchTap={this.openModal.bind(this)}
              primary
            />

            <ToolbarSeparator />
            <RaisedButton
              key="switch-assignee-mode-btn"
              label="View by assignee"
              className={buttonClassName}
              onTouchTap={this.changeViewMode.bind(this, 'assignee')}
              secondary
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
        <div className="container">
          <div className="task-list">
            {empty}
          </div>
        </div>
      </Paper>
    );
  }
}
MilestoneView.propTypes = propTypes;
export default MilestoneView;
