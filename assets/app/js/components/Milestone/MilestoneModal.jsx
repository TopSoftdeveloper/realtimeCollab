import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';


const propTypes = {
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  method: PropTypes.func.isRequired,
  deadline: PropTypes.string,
  content: PropTypes.string,
};

class MilestoneModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      deadline: this.props.deadline,
      canSubmit: false,
    };
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }
  onDateChange(first, newDate) {
    // Since there is no particular event associated with the change
    // the first argument will always be null and the
    // second argument will be the new Date instance.
    this.setState({
      deadline: newDate,
    });
  }
  onDialogSubmit() {
    const content = this.nameInputField.getValue().trim();
    const newDate = new Date(this.state.deadline);
    let isoDate = null;
    if (new Date().getTime() < newDate.getTime()) { // deadline must be after current time
      isoDate = newDate.toISOString();
    }
    if (content !== '') {
      this.props.method(content, isoDate);
    }
    this.props.handleClose();
  }
  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }
  disableButton() {
    this.setState({
      canSubmit: false,
    });
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
        disabled={!this.state.canSubmit}
      />,
    ];

    let picker = (
      <DatePicker
        hintText="Select a date"
        autoOk
        formatDate={this.formatDate}
        onChange={this.onDateChange}
        minDate={new Date()}
      />
    );

    if (this.props.deadline) {
      picker = (
        <DatePicker
          hintText="Select a date"
          autoOk
          formatDate={this.formatDate}
          onChange={this.onDateChange}
          defaultDate={new Date(this.props.deadline)}
          minDate={new Date()}
        />
      );
    }
    return (
      <Dialog
        autoScrollBodyContent
        title={this.props.title}
        actions={actions}
        onRequestClose={this.props.handleClose}
        open
        titleClassName="borderless"
        actionsContainerClassName="borderless"
      >
        <Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onValidSubmit={this.onDialogSubmit}
        >
          <FormsyText
            fullWidth
            autoFocus
            value={this.props.content}
            required
            name="Milestone name"
            floatingLabelText="Milestone Name(required)"
            ref={(input) => { this.nameInputField = input; }}
          />
          <br />
          {picker}
        </Form>
      </Dialog>
    );
  }
}
MilestoneModal.propTypes = propTypes;
export default MilestoneModal;
