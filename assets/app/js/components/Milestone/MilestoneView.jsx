import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-bootstrap';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Subheader from 'material-ui/Subheader';

import MilestoneModal from './MilestoneModal.jsx';
import MilestoneRow from './MilestoneRow.jsx';
import AssigneeRow from './AssigneeRow.jsx';
import AvatarList from '../Common/AvatarList.jsx';
import ProjectMessageView from '../../containers/ProjectMessageView.jsx';

const propTypes = {
  // props passed by parents
  projectId: PropTypes.string,
  // props passed by container
  milestones: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};
const styles = {
  viewMenuContainer: {
    borderBottom: '1px dotted grey',
    verticalAlign: 'middle',
    color: 'grey',
  },
  viewMenuIcon: {
    verticalAlign: 'middle',
    fontSize: 20,
  },
};
// predefined views
const VIEWS = {
  ongoingTasks: {
    value: 'ongoingTasks',
    label: 'Ongoing Tasks',
  },
  allTasks: {
    value: 'allTasks',
    label: 'All Tasks',
  },
  completedTasks: {
    value: 'completedTasks',
    label: 'Completed Tasks',
  },
  tasksAssignedTo: {
    value: 'tasksAssignedTo',
    label: 'Task Assigned to',
    assigneeId: null,
    assigneeName: '',
  },
  tasksByAssignee: {
    value: 'tasksByAssignee',
    label: 'Tasks by Assignee',
  },
};
class MilestoneView extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      isMilestoneModalOpen: false,
      view: VIEWS.ongoingTasks,
      messageView: {
        show: false,
      },
    };
    this.handleMilestoneModalClose = this.handleMilestoneModalClose.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
    this.openMilestoneModal = this.openMilestoneModal.bind(this);
    this.deleteMilestone = this.deleteMilestone.bind(this);
    this.editMilestone = this.editMilestone.bind(this);
    this.changeView = this.changeView.bind(this);
    this.matchCurrentView = this.matchCurrentView.bind(this);
    this.showMessageView = this.showMessageView.bind(this);
    this.dismissMessageView = this.dismissMessageView.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    // dismiss message view if swtich to a different project
    if (this.props.projectId !== nextProps.projectId) {
      this.setState({
        messageView: {
          show: false,
        },
      });
    }
  }
  matchCurrentView(viewValue) {
    return this.state.view.value === VIEWS[viewValue].value;
  }
  changeView(event, target) {
    // skip if view is changed to be `tasksAssignedTo`
    if (target.key !== VIEWS.tasksAssignedTo.value) {
      this.setState({
        view: VIEWS[target.key],
      });
    }
  }
  showMessageView(milestone) {
    this.setState({
      messageView: {
        show: true,
        messageMilestoneId: milestone.id,
        messageMilestoneName: milestone.content,
      },
    });
    this.props.actions.setSidebarVisibility(false);
  }
  dismissMessageView() {
    this.setState({
      messageView: {
        show: false,
      },
    });
    this.props.actions.setSidebarVisibility(true);
  }
  // handler for change view to be `tasksAssignedTo`
  changeViewAsTasksAssignedTo(assigneeId, assigneeName) {
    this.setState({
      view: assign({}, VIEWS.tasksAssignedTo, {
        assigneeId,
        assigneeName,
      }),
    });
  }
  handleMilestoneModalClose() {
    this.setState({
      isMilestoneModalOpen: false,
    });
  }

  openMilestoneModal() {
    this.setState({
      isMilestoneModalOpen: true,
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
  renderMilestoneModal() {
    return (this.state.isMilestoneModalOpen &&
      <MilestoneModal
        key="add-milestone-modal"
        title="Add Milestone"
        handleClose={this.handleMilestoneModalClose}
        method={this.addMilestone}
      />
    );
  }
  renderAssigneeRows() {
    const { users, tasks, projectId, actions } = this.props;
    const assigneeRows = [];
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
      display_name: 'Unassigned',
      display_image: null,
    };
    const unassignedTasks = tasks.filter(task => (
      !task.assignee_id || task.assignee_id === nonUser.id)
    );
    assigneeRows.unshift(
      <AssigneeRow
        projectId={projectId}
        key={nonUser.id}
        user={nonUser}
        users={users}
        actions={actions}
        tasks={unassignedTasks}
      />
    );
    return assigneeRows;
  }
  renderEmptyArea() {
    return (this.props.milestones.length === 0 &&
      <div className="task-list">
        <div className="no-items todo-empty">
          <h3>Your to-do list is empty!</h3>
          <p>Add something to get started</p>
        </div>
      </div>
    );
  }
  renderViewMenu() {
    const assigneMenuItems = this.props.users.map(user => (
      <MenuItem
        value={user.id}
        key={user.id}
        primaryText={user.display_name}
        onTouchTap={this.changeViewAsTasksAssignedTo.bind(this, user.id, user.display_name)}
      />
    ));
    assigneMenuItems.unshift(
      <MenuItem
        value={''}
        key={'Unassign'}
        primaryText="nobody"
        onTouchTap={this.changeViewAsTasksAssignedTo.bind(this, '', 'nobody')}
      />
    );
    const viewMenuItems = [
      <Subheader>Views</Subheader>,
      <MenuItem
        value={VIEWS.allTasks.value}
        key={VIEWS.allTasks.value}
        primaryText={VIEWS.allTasks.label}
      />,
      <MenuItem
        value={VIEWS.ongoingTasks.value}
        key={VIEWS.ongoingTasks.value}
        primaryText={VIEWS.ongoingTasks.label}
      />,
      <MenuItem
        value={VIEWS.completedTasks.value}
        key={VIEWS.completedTasks.value}
        primaryText={VIEWS.completedTasks.label}
      />,
      <Divider />,
      <MenuItem
        menuItems={assigneMenuItems}
        key={VIEWS.tasksAssignedTo.value}
        primaryText={VIEWS.tasksAssignedTo.label}
        rightIcon={<ArrowDropRight />}

      />,
      <Divider />,
      <MenuItem
        value={VIEWS.tasksByAssignee.value}
        key={VIEWS.tasksByAssignee.value}
        primaryText={VIEWS.tasksByAssignee.label}
      />,
    ];
    let text = `View: ${this.state.view.label} `;
    if (this.state.view.value === VIEWS.tasksAssignedTo.value) {
      text += this.state.view.assigneeName;
    }
    return (
      <IconMenu
        iconButtonElement={
          <div style={styles.viewMenuContainer}>{text}
            <i style={styles.viewMenuIcon} className="material-icons">arrow_drop_down</i>
          </div>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onItemTouchTap={this.changeView}
      >
        {viewMenuItems}
      </IconMenu>

    );
  }
  renderCreateMilestoneButton() {
    return (this.state.view.value !== VIEWS.tasksByAssignee.value &&
      <RaisedButton
        key="add-milestone-btn"
        label="Add Milestone"
        className={this.props.milestones.length === 0 ? 'animated infinite pulse' : ''}
        onTouchTap={this.openMilestoneModal}
        secondary
      />
    );
  }
  renderMessageView() {
    return (this.state.messageView.show &&
      <Col md={6}>
        <Paper zDepth={1} className="milestone-message-view">
          <ProjectMessageView
            milestoneId={this.state.messageView.messageMilestoneId}
            title={this.state.messageView.messageMilestoneName}
            onDismiss={this.dismissMessageView}
          />
        </Paper>
      </Col>
    );
  }
  render() {
    const { users, tasks, projectId, actions, milestones } = this.props;
    let content = null;
    // condition for assignee mode
    if (this.matchCurrentView('tasksByAssignee')) {
      content = this.renderAssigneeRows();
    } else {
      const filterByAssignee = task => (
        !this.matchCurrentView('tasksAssignedTo') ||
          task.assignee_id === this.state.view.assigneeId
      );
      const filteredTasks = tasks.filter(filterByAssignee);

      const showOngoing = !this.matchCurrentView('completedTasks');
      const showCompleted = this.matchCurrentView('completedTasks') ||
        this.matchCurrentView('allTasks');

      // deadline sorting function
      // milestones without a deadline should be always be put in bottom
      const sortByDeadline = (milestoneA, milestoneB) => {
        let deadlineA = milestoneA.deadline;
        let deadlineB = milestoneB.deadline;
        const sortByDeadlineDescending = false;
        const scala = sortByDeadlineDescending ? 1 : -1;
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
      const milestoneList = [...milestones];
      milestoneList.sort(sortByDeadline).forEach(milestone => {
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
              onSelect={this.showMessageView}
              onEditMilestone={onEdit}
              onDeleteMilestone={onDelete}
              projectId={projectId}
              key={milestone.id || 'defaultMilestone'}
              users={users}
              actions={actions}
              tasks={taskList}
              showOngoing={showOngoing}
              showCompleted={showCompleted}
            />
          );
          milestoneRows.push(milestoneView);
        }
      }); // milestones.forEach
      content = milestoneRows.length === 0 ? this.renderEmptyArea() : milestoneRows;
    }
    return (
      <Row >
        <Col
          style={assign({}, this.state.messageView.show && {
            paddingRight: 5,
          })}
          md={this.state.messageView.show ? 6 : 12}
        >
          <Paper className="milestone-menu-view" zDepth={1}>
            <Toolbar>
              <ToolbarGroup firstChild key="firstToolbarGroup">
                {this.renderCreateMilestoneButton()}
                <AvatarList
                  className="milestone-online-users"
                  members={users.filter(user => user.online && !user.me)}
                  isSquare
                  colour
                />
              </ToolbarGroup>
              <ToolbarGroup key="secondToolbarGroup">
                {this.renderViewMenu()}
              </ToolbarGroup>
              {this.renderMilestoneModal()}
            </Toolbar>
            {content}
          </Paper>
        </Col>
        {this.renderMessageView()}
      </Row>

    );
  }
}
MilestoneView.propTypes = propTypes;
export default MilestoneView;
