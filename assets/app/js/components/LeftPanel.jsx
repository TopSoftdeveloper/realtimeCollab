import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import List from './List.jsx';

class LeftPanel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false,
            canSubmit: false
        }
    }

    handleRequestClose(buttonClicked) {
        if (!buttonClicked && this.state.openDialogStandardActions) return
        this.setState({
            isDialogOpen: false
        })
    }
    onDialogSubmit() {
        let content = this.refs.projectField.getValue().trim()
        if (content !== '') {
            this.props.onCreateProject(content)
        }
        this.setState({
            isDialogOpen: false
        })
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
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
        let actions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleRequestClose.bind(this)} />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this.onDialogSubmit.bind(this)}
                disabled={!this.state.canSubmit} />
        ]

        return (
            <div>
                <div className="collab-logo">
                    <h3>Collab</h3>
                </div>
                <List
                    currentProject={this.props.currentProject}
                    subheader="Projects"
                    items={this.props.projects}
                    app={this.props.app}
                    actions={this.props.actions}
                    onAddProject={this.openModal.bind(this)}
                />

                  <Paper>

                    <Dialog
                        autoScrollBodyContent
                        title="Add Project"
                        actions={actions}
                        open={this.state.isDialogOpen}
                        onRequestClose={this.handleRequestClose.bind(this)}>
                      <Form
                          onValid={this.enableButton.bind(this)}
                          onInvalid={this.disableButton.bind(this)}
                          onValidSubmit={this.onDialogSubmit.bind(this)}
                          onInvalidSubmit={this.notifyFormError}
                      >
                        <FormsyText
                          autoFocus
                          name="Project name"
                          validations="isWords"
                          validationError={"Please use only letters"}
                          required
                          floatingLabelText="Project Name(required)"
                          ref="projectField"
                        />
                      </Form>
                    </Dialog>

                </Paper>

            </div>
        );
    }
}

export default LeftPanel
