import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Checkbox from 'material-ui/Checkbox';

import * as SocketActions from '../../actions/SocketActions';
import AvatarList from '../Common/AvatarList.jsx';
import TaskModal from './TaskModal.jsx';

const propTypes = {
  task: PropTypes.object.isRequired,
  assignees: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  highlight: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};
class TaskRow extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hidden: true,
      isDialogOpen: false,
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  onMouseEnter() {
    this.setState({
      hidden: false,
    });
  }
  onMouseLeave() {
    this.setState({
      hidden: true,
    });
  }
  onEdit(content, assigneeId) {
    this.props.onEdit(this.props.task.id, content, assigneeId);
  }
  onCheck() {
    this.props.onCheck(this.props.task.id);
  }
  onDelete() {
    this.props.onDelete(this.props.task.id);
  }
  openModal() {
    this.setState({
      isDialogOpen: true,
    });
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userIsEditing('task', this.props.task.id);
  }

  handleClose() {
    this.setState({
      isDialogOpen: false,
    });
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userStopsEditing('task', this.props.task.id);
  }
  renderActionButton() {
    return (!this.state.hidden &&
      <div className="task-actions">
        <i
          className="material-icons edit-task"
          onClick={this.openModal}
        >mode_edit</i>
        <i
          className="material-icons delete-task"
          onClick={this.onDelete}
        >delete</i>
      </div>
    );
  }
  renderTaskModal() {
    return (this.state.isDialogOpen &&
      <TaskModal
        title="Edit Task"
        content={this.props.task.content}
        assignee={this.props.task.assignee_id}
        handleClose={this.handleClose}
        taskMethod={this.onEdit}
        users={this.props.users}
      />
    );
  }
  render() {
    let taskContentClass = 'task-content';
    if (this.props.highlight) {
      taskContentClass = `${taskContentClass} highlight-yellow`;
    }

    // EDITING INDICATOR
    let editIndicator = null;
    let listStyle = {};

    if (this.props.task.editing) {
      const editor = this.props.users.filter(user => user.id === this.props.task.edited_by)[0];
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
        listStyle = {
          borderStyle: 'solid',
          borderColor: editor.colour,
        };
      }
    }

    return (
      <div
        className="task-row"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={listStyle}
      >
        <Row>
          <Col xs={11}>
            <div className="task-checkbox">
              <Checkbox onTouchTap={this.onCheck} />
            </div>
            <div className={taskContentClass}>
              {this.props.task.content}
              {this.renderActionButton()}
            </div>
          </Col>
          <Col xs={1}>
            <AvatarList
              className="assignee-avatar"
              isSquare
              size={24}
              members={this.props.assignees}
            />
            {editIndicator}
          </Col>
        </Row>
        {this.renderTaskModal()}
      </div>
    );
  }
}
TaskRow.propTypes = propTypes;
export default connect()(TaskRow);
