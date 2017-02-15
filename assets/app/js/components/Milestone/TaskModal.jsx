import React, { Component, PropTypes } from 'react';
import { Dialog, TextField, FlatButton } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Subheader from 'material-ui/Subheader';

const propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  taskMethod: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
class TaskModal extends Component {
  constructor(props, context) {
    super(props, context);
    if (this.props.assignee) {
      this.state = {
        assignee: this.props.assignee,
      };
    } else {
      this.state = {
        assignee: '',
      };
    }
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  onDialogSubmit() {
    const content = this.taskInputField.getValue().trim();
    if (content !== '') {
      this.props.taskMethod(content, this.state.assignee);
    }
    this.props.handleClose();
  }

  handleChange(event, index, value) {
    this.setState({ assignee: value });
  }

  render() {
    const actions = [
      <FlatButton
        key={1}
        label="Cancel"
        secondary
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        key={2}
        label="Submit"
        primary
        onTouchTap={this.onDialogSubmit}
      />,
    ];


    const possibleAssignees = this.props.users.map(user => (
      <MenuItem
        value={user.id}
        key={user.id}
        primaryText={user.display_name}
      />
    ));

    possibleAssignees.unshift(<MenuItem key={0} primaryText="None" />);

    return (
      <Dialog
        autoScrollBodyContent
        title={<Subheader>{this.props.title}</Subheader>}
        actions={actions}
        onRequestClose={this.props.handleClose}
        open={this.props.open}
        titleClassName="borderless"
        actionsContainerClassName="borderless"
      >
        <TextField
          fullWidth
          multiLine
          hintText="Task name"
          onEnterKeyDown={this.onDialogSubmit}
          ref={(input) => { this.taskInputField = input; }}
          defaultValue={this.props.content}
        />
        <br />
        <SelectField
          value={this.state.assignee}
          onChange={this.handleChange}
          floatingLabelText="Assign to"
        >
          {possibleAssignees}
        </SelectField>
      </Dialog>
    );
  }
}
TaskModal.propTypes = propTypes;
export default TaskModal;
