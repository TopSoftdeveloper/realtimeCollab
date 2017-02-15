import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  onDialogSubmit: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};

class RenameModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.props.handleClose;
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.state = {
      canSubmit: false,
    };
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
        onClick={() => { this.textInput.focus(); }}
        titleClassName="borderless"
        actionsContainerClassName="borderless"
      >
        <Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onValidSubmit={this.onDialogSubmit}
        >
          <FormsyText
            required
            value={inputValue}
            name="File Name"
            floatingLabelText="New File Name(required)"
            ref={(input) => { this.textInput = input; }}
          />
        </Form>
      </Dialog>
    );
  }
}
RenameModal.propTypes = propTypes;
export default RenameModal;
