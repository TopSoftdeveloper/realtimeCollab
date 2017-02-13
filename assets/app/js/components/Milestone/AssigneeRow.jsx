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
import CompletedRow from './CompletedRow.jsx';
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


  render() {
    const { users, user, actions, tasks } = this.props;
    const taskList = [];
    const ongoingTasks = this.props.tasks.filter(task => !task.completed_on && !task.dirty);
    ongoingTasks.forEach(task => {
      if (this.state.showOngoing) {
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
            onCheck={this.markDone.bind(this, task.id)}
            onEdit={this.editTask.bind(this, task.id)}
            onDelete={this.deleteTask.bind(this, task.id)}
            users={users}
            highlight={highlight}
          />
        );
      }
    }); // task forEach
    const completedTasks = tasks.filter(task => task.completed_on);
    if (this.state.showCompleted && completedTasks.length > 0) {
      taskList.push(
        <CompletedRow
          key={_.uniqueId('completed')}
          completedTasks={completedTasks}
          actions={actions}
          highlightId={this.context.location.query.highlight}
        />
      );
    }

    const ongoingText = `${ongoingTasks.length} Ongoing`;
    const completedTask = `${completedTasks.length} Completed`;
    const ongoingLabelStyle = {
      opacity: this.state.showOngoing ? 1 : 0.5,
    };
    const completedLabelStyle = {
      opacity: this.state.showCompleted ? 1 : 0.5,
    };
    const milestoneInfo = (
      <div className="milestone-row-info">
        <FlatButton
          labelStyle={ongoingLabelStyle}
          label={ongoingText}
          primary
          onTouchTap={this.toggleOngoing.bind(this)}
        />
        <FlatButton
          labelStyle={completedLabelStyle}
          label={completedTask}
          secondary
          onTouchTap={this.toggleCompleted.bind(this)}
        />
      </div>
    );

    return (
      <Paper zDepth={0}>
        <Grid fluid>
          <div className="milestone-row">
            <Divider />
            <div className="milestone-row-header">
              <Grid fluid>
                <Row>
                  <Col xs={10}>
                    <div className="milestone-title">
                      {user.display_name}
                      {milestoneInfo}
                    </div>
                  </Col>
                  <Col xs={2}>
                    <div className="pull-right">
                      <IconButton
                        tooltip="new task"
                        tooltipPosition="top-right"
                        onClick={this.openModal}
                      >
                        <AddIcon />
                      </IconButton>
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
              handleClose={this.handleClose}
              assignee={user.id}
              taskMethod={this.addTask}
              users={users}
            />
          </div>
        </Grid >
      </Paper>
    );
  }
}

AssigneeRow.propTypes = propTypes;
AssigneeRow.contextTypes = contextTypes;

export default connect()(AssigneeRow);
