import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import AddIcon from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { Grid, Row, Col } from 'react-bootstrap';

import TaskRow from './TaskRow.jsx';
import CompletedTask from './CompletedTask.jsx';
import TaskModal from './TaskModal.jsx';

const propTypes = {
  projectId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};
const contextTypes = {
  location: React.PropTypes.object,
};

class AssigneeRow extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      showOngoing: true,
      showCompleted: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.addTask = this.addTask.bind(this);
    this.openModal = this.openModal.bind(this);
    this.toggleOngoing = this.toggleOngoing.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.markDone = this.markDone.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.reopenTask = this.reopenTask.bind(this);
  }

  toggleOngoing() {
    this.setState({
      showOngoing: !this.state.showOngoing,
    });
  }
  toggleCompleted() {
    this.setState({
      showCompleted: !this.state.showCompleted,
    });
  }
  openModal() {
    this.setState({
      isDialogOpen: true,
    });
  }
  handleClose() {
    this.setState({
      isDialogOpen: false,
    });
  }
  addTask(content, assigneeId) {
    const task = {
      id: _.uniqueId('task'), // temp id
      content,
      project_id: this.props.projectId,
      milestone_id: null,
      assignee_id: assigneeId,
    };
    this.props.actions.addTask(task);
  }
  deleteTask(taskId) {
    this.props.actions.deleteTask(taskId, this.props.projectId);
  }
  markDone(taskId) {
    this.props.actions.markDone(taskId, this.props.projectId);
  }
  editTask(taskId, content, assignee) {
    this.props.actions.editTask(taskId, content, assignee);
  }
  reopenTask(taskId) {
    this.props.actions.reopenTask(taskId);
  }
  renderTaskModal() {
    return (this.state.isDialogOpen &&
      <TaskModal
        key="TaskModalInAssigneeView"
        title="Add Task"
        open
        handleClose={this.handleClose}
        assignee={this.props.user.id}
        taskMethod={this.addTask}
        users={this.props.users}
      />
    );
  }
  renderAssigneeInfo(ongoingTasks, completedTasks) {
    const ongoingText = `${ongoingTasks.length} Ongoing`;
    const completedTask = `${completedTasks.length} Completed`;
    const ongoingLabelStyle = {
      opacity: this.state.showOngoing ? 1 : 0.5,
    };
    const completedLabelStyle = {
      opacity: this.state.showCompleted ? 1 : 0.5,
    };
    return (
      <div className="milestone-row-info">
        <FlatButton
          labelStyle={ongoingLabelStyle}
          label={ongoingText}
          primary
          onTouchTap={this.toggleOngoing}
        />
        <FlatButton
          labelStyle={completedLabelStyle}
          label={completedTask}
          secondary
          onTouchTap={this.toggleCompleted}
        />
      </div>
    );
  }
  renderTaskList(ongoingTasks, completedTasks) {
    const taskList = [];
    if (this.state.showOngoing) {
      ongoingTasks.forEach(task => {
        // Only show non-completed tasks and non-dirtied tasks
        const assignees = this.props.users.filter(u => u.id === task.assignee_id);
        const highlightId = this.context.location.query.highlight;
        let highlight = false;
        if (highlightId === task.id) {
          highlight = true;
        }
        taskList.push(
          <TaskRow
            key={_.uniqueId('task')}
            task={task}
            assignees={assignees}
            onCheck={this.markDone}
            onEdit={this.editTask}
            onDelete={this.deleteTask}
            users={this.props.users}
            highlight={highlight}
          />
        );
      });
    }
    if (this.state.showCompleted) {
      completedTasks.forEach(task => {
        const highlightId = this.context.location.query.highlight;
        let highlight = false;
        if (highlightId === task.id) {
          highlight = true;
        }
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
  render() {
    const { user, tasks } = this.props;
    const ongoingTasks = this.props.tasks.filter(task => !task.completed_on && !task.dirty);
    const completedTasks = tasks.filter(task => task.completed_on);

    return (
      <Paper zDepth={0}>
        <Grid fluid>
          <div className="milestone-row">
            <Divider />
            <div className="milestone-row-header">
              <Row>
                <Col xs={10}>
                  <div className="milestone-title">
                    {user.display_name}
                    {this.renderAssigneeInfo(ongoingTasks, completedTasks)}
                  </div>
                </Col>
                <Col xs={2}>
                  <div className="pull-right">
                    <IconButton
                      tooltip="new task"
                      tooltipPosition="top-right"
                      onTouchTap={this.openModal}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </Col>
              </Row>
            </div>
            <div>
              {this.renderTaskList(ongoingTasks, completedTasks)}
            </div>
            {this.renderTaskModal()}
          </div>
        </Grid >
      </Paper>
    );
  }
}

AssigneeRow.propTypes = propTypes;
AssigneeRow.contextTypes = contextTypes;

export default connect()(AssigneeRow);
