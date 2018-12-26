import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import AddIcon from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { Grid, Row, Col } from 'react-bootstrap';

import TaskRow from './TaskRow.jsx';
import CompletedTask from './CompletedTask.jsx';
import TaskModalView from '../../containers/TaskModalView.jsx';
import MilestoneModal from './MilestoneModal.jsx';
import * as SocketActions from '../../actions/SocketActions';

const propTypes = {
  milestone: PropTypes.object.isRequired,
  onEditMilestone: PropTypes.func,
  onDeleteMilestone: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  showOngoing: PropTypes.bool,
  showCompleted: PropTypes.bool,
  isHighlight: PropTypes.bool,
};

const contextTypes = {
  location: React.PropTypes.object,
};

class MilestoneRow extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isTaskModalOpen: false,
      isMilestoneModalOpen: false,
      showActionButton: false,
      isDeleteConfirmationOpen: false,
      showOngoing: props.showOngoing,
      showCompleted: props.showCompleted,
    };
    this.openMilestoneModal = this.openMilestoneModal.bind(this);
    this.handleMilestoneModalClose = this.handleMilestoneModalClose.bind(this);
    this.handleDeleteConfirmationOpen = this.handleDeleteConfirmationOpen.bind(this);
    this.editMilestone = this.editMilestone.bind(this);
    this.deleteMilestone = this.deleteMilestone.bind(this);
    this.handleDeleteConfirmationClose = this.handleDeleteConfirmationClose.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.handleTaskModalClose = this.handleTaskModalClose.bind(this);
    this.addTask = this.addTask.bind(this);
    this.openTaskModal = this.openTaskModal.bind(this);
    this.toggleOngoing = this.toggleOngoing.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.markDone = this.markDone.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.reopenTask = this.reopenTask.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showOngoing !== this.props.showOngoing ||
    nextProps.showCompleted !== this.props.showCompleted) {
      this.setState({
        showOngoing: nextProps.showOngoing,
        showCompleted: nextProps.showCompleted,
      });
    }
  }
  onMouseEnter() {
    this.setState({
      showActionButton: true,
    });
  }
  onMouseLeave() {
    this.setState({
      showActionButton: false,
    });
  }
  onSelect() {
    this.props.onSelect(this.props.milestone);
  }
  toggleOngoing(e) {
    e.stopPropagation();
    this.setState({
      showOngoing: !this.state.showOngoing,
    });
  }
  toggleCompleted(e) {
    e.stopPropagation();
    this.setState({
      showCompleted: !this.state.showCompleted,
    });
  }
  openTaskModal(e) {
    e.stopPropagation();
    this.setState({
      isTaskModalOpen: true,
    });
  }
  openMilestoneModal(e) {
    e.stopPropagation();
    this.setState({
      isMilestoneModalOpen: true,
    });
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userIsEditing('milestone', this.props.milestone.id);
  }

  handleMilestoneModalClose() {
    this.setState({
      isMilestoneModalOpen: false,
    });
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userStopsEditing('milestone', this.props.milestone.id);
  }
  handleTaskModalClose() {
    this.setState({
      isTaskModalOpen: false,
    });
  }
  handleDeleteConfirmationOpen(e) {
    e.stopPropagation();
    this.setState({
      isDeleteConfirmationOpen: true,
    });
  }
  handleDeleteConfirmationClose() {
    this.setState({
      isDeleteConfirmationOpen: false,
    });
  }

  deleteMilestone() {
    // delete all tasks inside milestone first
    this.props.tasks.forEach(task => {
      this.deleteTask(task.id);
    });
    this.props.onDeleteMilestone(this.props.milestone.id);
  }
  editMilestone(content, deadline) {
    this.props.onEditMilestone(this.props.milestone.id, content, deadline);
  }

  addTask(content, assigneeId, milestoneId, isGithubIssue) {
    const task = {
      id: _.uniqueId('task'), // temp id
      content,
      project_id: this.props.projectId,
      milestone_id: milestoneId,
      assignee_id: assigneeId,
      isGithubIssue
    };
    this.props.actions.addTask(task);
  }
  deleteTask(taskId) {
    this.props.actions.deleteTask(taskId, this.props.projectId);
  }
  markDone(taskId) {
    this.props.actions.markDone(taskId, this.props.projectId);
  }
  editTask(taskId, content, assignee, milestoneId) {
    this.props.actions.editTask(taskId, content, assignee, milestoneId);
  }
  reopenTask(taskId) {
    this.props.actions.reopenTask(taskId);
  }
  renderConfirmDeleteModal(ongoingTasks) {
    const confirmDeleteActions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={this.handleDeleteConfirmationClose}
      />,
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={this.deleteMilestone}
      />,
    ];
    let confirmDeleteMsg = 'Are you sure to delete this milestone?';
    if (ongoingTasks.length > 0) {
      confirmDeleteMsg = `You still have ${ongoingTasks.length} ongoing task(s).
      ${confirmDeleteMsg}`;
    }
    return (this.state.isDeleteConfirmationOpen &&
      <Dialog
        autoScrollBodyContent
        actions={confirmDeleteActions}
        modal={false}
        open={this.state.isDeleteConfirmationOpen}
        onRequestClose={this.handleDeleteConfirmationClose}
      >
        {confirmDeleteMsg}
      </Dialog>
    );
  }
  renderTaskModal() {
    return (this.state.isTaskModalOpen &&
      <TaskModalView
        key={`${this.props.milestone.id}_taskModal`}
        title="Add Task"
        open={this.state.isTaskModalOpen}
        handleClose={this.handleTaskModalClose}
        taskMethod={this.addTask}
        milestoneId={this.props.milestone.id}
        userIsEditing={false}
      />
    );
  }
  renderMilestoneModal() {
    return (this.state.isMilestoneModalOpen &&
      <MilestoneModal
        key={`${this.props.milestone.id}_milestoneModal`}
        title="Edit Milestone"
        open={this.state.isMilestoneModalOpen}
        handleClose={this.handleMilestoneModalClose}
        method={this.editMilestone}
        deadline={this.props.milestone.deadline}
        content={this.props.milestone.content}
      />
    );
  }
  renderTaskList(ongoingTasks, completedTasks) {
    const taskList = [];
    ongoingTasks.forEach(task => {
      if (this.state.showOngoing) {
        // Only show non-completed tasks and non-dirtied tasks
        const assignees = this.props.users.filter(user => user.id === task.assignee_id);
        const highlight = this.context.location && this.context.location.query &&
          this.context.location.query.highlight &&
          this.context.location.query.highlight === task.id;
        taskList.push(
          <TaskRow
            key={task.id}
            task={task}
            assignees={assignees}
            onCheck={this.markDone}
            onEdit={this.editTask}
            onDelete={this.deleteTask}
            users={this.props.users}
            highlight={highlight}
          />
        );
      }
    }); // task forEach
    if (this.state.showCompleted) {
      completedTasks.forEach(task => {
        const highlight = this.context.location && this.context.location.query &&
          this.context.location.query.highlight &&
          this.context.location.query.highlight === task.id;
        taskList.push(
          <CompletedTask
            key={task.id}
            task={task}
            reopenTask={this.reopenTask}
            highlight={highlight}
          />
        );
      });
    }
    return taskList;
  }
  renderSubtitle() {
    let deadlineText = null;
    if (this.props.milestone.deadline) {
      const eventTime = new Date(this.props.milestone.deadline);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      deadlineText = `Due by ${eventTime.toLocaleDateString('en-US', options)}`;
    }
    return (
      <p style={{ fontSize: 12, marginBottom: 0 }} className="text-muted">
        {deadlineText}
      </p>
    );
  }
  renderMilestoneActions() {
    return (this.props.milestone.id && this.state.showActionButton
      && !this.props.milestone.editing &&
      <div className="milestone-actions">
        <i
          className="material-icons edit-task"
          onClick={this.openMilestoneModal}
        >
          mode_edit
        </i>
        <i
          className="material-icons delete-task"
          onClick={this.handleDeleteConfirmationOpen}
        >
        delete
      </i>
      </div>
    );
  }
  renderMilestoneInfo(ongoingTasks, completedTasks) {
    const ongoingText = `${ongoingTasks.length}  Ongoing`;
    const completedText = `${completedTasks.length} Completed`;
    const ongoingLabelStyle = {
      opacity: this.state.showOngoing ? 1 : 0.5,
      fontSize: 12,
    };
    const completedLabelStyle = {
      opacity: this.state.showCompleted ? 1 : 0.5,
      fontSize: 12,
      color: 'grey',
    };
    return (
      <div className="milestone-row-info">
        <FlatButton
          labelStyle={ongoingLabelStyle}
          label={ongoingText}
          primary
          onClick={this.toggleOngoing}
        />
        <FlatButton
          labelStyle={completedLabelStyle}
          label={completedText}
          onClick={this.toggleCompleted}
        />
      </div>
    );
  }
  renderAddTaskButton() {
    return (
      <span style={{marginTop: -10}} className="pull-right">
        <IconButton
          className="add-task-btn"
          tooltip="new task"
          tooltipPosition="bottom-center"
          onClick={this.openTaskModal}
        >
          <AddIcon />
        </IconButton>
      </span>
    );
  }
  render() {
    const { tasks, milestone, users, isHighlight } = this.props;
    const ongoingTasks = tasks.filter(task => !task.completed_on && !task.dirty);
    const completedTasks = tasks.filter(task => task.completed_on);
    // EDITING INDICATOR
    let editIndicator = null;
    let listStyle = assign({}, {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // material standard
    }, isHighlight && {
      backgroundColor: 'rgba(0, 188, 212, 0.1)',
    });

    if (milestone.editing) {
      const editor = users.filter(user =>
        user.id === milestone.edited_by)[0];
      if (editor && editor.online) {
        const divStyle = {
          float: 'right',
          fontSize: 'smaller',
          color: 'white',
          background: editor.colour,
          fontWeight: 'bold',
        };

        editIndicator = (
          <div style={divStyle}>{editor.display_name} is editing</div>
        );
        listStyle = assign({}, listStyle, {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: editor.colour,
        });
      }
    }
    return (
      <Paper zDepth={0} style={listStyle} >
        <Grid
          fluid
          id={`milestone-${milestone.content.replace(/\s/g, '')}`}
          className="milestone-row"
          onClick={this.onSelect}
        >
          <div>
            {editIndicator}
            <div className="milestone-row-header">
              <Row>
                <Col xs={10}>
                  <div
                    className="milestone-title"
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                  >
                    <span>{milestone.content}</span>
                    {this.renderMilestoneActions()}
                    {this.renderMilestoneInfo(ongoingTasks, completedTasks)}
                  </div>
                  <smaill>
                    {this.renderSubtitle()}
                  </smaill>
                </Col>
                <Col xs={2}>
                  {this.renderAddTaskButton()}
                </Col>
              </Row>
            </div>
            <div>
              {this.renderTaskList(ongoingTasks, completedTasks)}
            </div>
          </div>
          {this.renderTaskModal()}
          {this.renderMilestoneModal()}
          {this.renderConfirmDeleteModal(ongoingTasks)}
        </Grid >
      </Paper>
    );
  }
}

MilestoneRow.contextTypes = contextTypes;
MilestoneRow.propTypes = propTypes;
export default connect()(MilestoneRow);
