import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  onDialogSubmit: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
};

class RenameModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      canSubmit: false,
    };
    this.handleClose = this.props.handleClose;
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }
  onDialogSubmit() {
    this.props.onDialogSubmit(this.textInput.getValue().trim());
    this.props.handleClose();
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
    const { inputValue } = this.props;
    const renameModalActions = [
      <FlatButton
        key={13}
        label="Cancel"
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        key={23}
        label="Submit"
        primary
        onTouchTap={this.onDialogSubmit}
        disabled={!this.state.canSubmit}
      />,
    ];
    return (
      <Dialog
        autoScrollBodyContent
        actions={renameModalActions}
        onRequestClose={this.handleClose}
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
            autoFocus
            required
            fullWidth
            value={inputValue}
            name="Project name"
            validations="isAlphanumeric"
            validationError={'Please use only letters and numbers'}
            required
            floatingLabelText="Project Name(required)"
            ref={(input) => { this.textInput = input; }}
          />
        </Form>
      </Dialog>
    );
  }
}
RenameModal.propTypes = propTypes;
export default RenameModal;
