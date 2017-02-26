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
    this.toggleSortByDeadline = this.toggleSortByDeadline.bind(this);
    this.changeViewModeToMilestone = this.changeViewMode.bind(this, 'milestone');
    this.clearFilterAndSort = this.clearFilterAndSort.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
    this.changeViewModeToAssignee = this.changeViewMode.bind(this, 'assignee');
    this.applyAssigneeFilter = this.applyAssigneeFilter.bind(this);
    this.openModal = this.openModal.bind(this);
    this.deleteMilestone = this.deleteMilestone.bind(this);
    this.editMilestone = this.editMilestone.bind(this);
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
  renderResetButton() {
    return (this.state.showResetButton &&
      <FlatButton
        label="Clear all filters and sorts"
        onTouchTap={this.clearFilterAndSort}
        hoverColor="transparent"
        primary={false}
        icon={<ClearIcon />}
      />
    );
  }
  renderMilestoneModal() {
    return (this.state.isDialogOpen &&
      <MilestoneModal
        key="add-milestone-modal"
        title="Add Milestone"
        handleClose={this.handleClose}
        method={this.addMilestone}
      />
    );
  }
  renderAssigneeView() {
    const { users, tasks, projectId, actions } = this.props;
    const assigneeRows = [];
    // console.log(users)
    users.forEach(user => {
      const taskList = tasks.filter(task => task.assignee_id === user.id);
      const assigneeRow = (
        <AssigneeRow
          projectId={projectId}
          key={user.id}
          user={user}
          users={users}
          actions={actions}
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
    const taskList = tasks.filter(task => (
      !task.assignee_id || task.assignee_id === nonUser.id)
    );
    assigneeRows.unshift(
      <AssigneeRow
        projectId={projectId}
        key={nonUser.id}
        user={nonUser}
        users={users}
        actions={actions}
        tasks={taskList}
      />
    );
    return (
      <Paper zDepth={0} className="milestone-menu-view">
        <Toolbar>
          <ToolbarGroup firstChild>
            <AvatarList
              className="milestone-online-users"
              members={users.filter(user => user.online && !user.me)}
              isSquare
              colour
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarSeparator />
            <RaisedButton
              key="switch-milestone-mode-btn"
              label="View by milestone"
              onTouchTap={this.changeViewModeToMilestone}
              secondary
            />
          </ToolbarGroup>
        </Toolbar>
        {assigneeRows}
      </Paper>
    );
  }
  renderEmptyArea() {
    return (this.props.milestones.length === 0 &&
      <div className="container">
        <div className="task-list">
          <div className="no-items todo-empty">
            <h3>Your to-do list is empty!</h3>
            <p>Add something to get started</p>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { users, tasks, projectId, actions, milestones } = this.props;
    // condition for assignee mode
    if (this.state.viewBy === 'assignee') {
      return this.renderAssigneeView();
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
    const fullMilestones = [{
      content: 'Task without milestone',
      deadline: null,
      key: 'uncategorized-tasks',
      id: null,
    }, ...milestones]; // Just a placeholder milestone for tasks without milestones
    let filteredTasks = tasks;
    if (this.state.isFilterApplied) {
      filteredTasks = tasks.filter(filterByAssignee);
    }
    fullMilestones.sort(sortByDeadline).forEach(milestone => {
      // console.log(milestone)
      let onDelete = null;
      let onEdit = null;
      if (milestone.id) {
        onDelete = this.deleteMilestone;
        onEdit = this.editMilestone;
      }
      const taskList = filteredTasks.filter(task => task.milestone_id === milestone.id);
      if (taskList.length > 0 || !this.state.isFilterApplied) {
        const milestoneView = (
          <MilestoneRow
            milestone={milestone}
            onEditMilestone={onEdit}
            onDeleteMilestone={onDelete}
            projectId={projectId}
            key={milestone.id || 'defaultMilestone'}
            users={users}
            actions={actions}
            tasks={taskList}
          />
        );
        milestoneRows.push(milestoneView);
      }
    }); // milestones.forEach
    let buttonClassName = 'add-milestone-btn';
    if (fullMilestones.length === 1 && tasks.length === 0) {
      buttonClassName += 'animated infinite pulse';
    }
    const AssignesMenuItems = users.map(user => (
      <MenuItem value={user.id} key={user.id} primaryText={user.display_name} />
    ));
    AssignesMenuItems.unshift(<MenuItem value={''} key={''} primaryText="None" />);
    AssignesMenuItems.unshift(<MenuItem value={'all'} key={'all'} primaryText="All" />);

    const assigneeFilterTooltip = <Tooltip id="assignee">filter by asssignees</Tooltip>;
    const sortByDeadlineTooltip = <Tooltip id="deadline">sort by deadline</Tooltip>;
    return (
      <Paper zDepth={1} className="milestone-menu-view">
        <div key="resetButton">{this.renderResetButton()}</div>
        <Toolbar>
          <ToolbarGroup firstChild key="firstToolbarGroup">
            <OverlayTrigger placement="bottom" overlay={assigneeFilterTooltip}>
              <DropDownMenu
                maxHeight={300}
                value={this.state.assigneeFilter}
                onChange={this.applyAssigneeFilter}
              >
                {AssignesMenuItems}
              </DropDownMenu>
            </OverlayTrigger>
            <AvatarList
              className="milestone-online-users"
              members={users.filter(user => user.online && !user.me)}
              isSquare
              colour
            />
          </ToolbarGroup>
          <ToolbarGroup key="secondToolbarGroup">
            <OverlayTrigger placement="bottom" overlay={sortByDeadlineTooltip}>
              <FlatButton
                label={this.state.sortByDeadlineDescending ? 'Earliest' : 'Oldest'}
                onClick={this.toggleSortByDeadline}
                primary={false}
              />
            </OverlayTrigger>
            <RaisedButton
              key="add-milestone-btn"
              label="Add Milestone"
              className={buttonClassName}
              onTouchTap={this.openModal}
              primary
            />

            <ToolbarSeparator />
            <RaisedButton
              key="switch-assignee-mode-btn"
              label="View by assignee"
              className={buttonClassName}
              onTouchTap={this.changeViewModeToAssignee}
              secondary
            />
          </ToolbarGroup>
          {this.renderMilestoneModal()}
        </Toolbar>
        {milestoneRows}
        {this.renderEmptyArea()}
      </Paper>
    );
  }
}
MilestoneView.propTypes = propTypes;
export default MilestoneView;
