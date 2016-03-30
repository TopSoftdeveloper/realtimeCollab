import React, { Component } from 'react';
import List from './List.jsx'
import { IconButton, Dialog, TextField, FlatButton } from 'material-ui'

class LeftPanel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false
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

    render() {
        let actions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />
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
                <Dialog
                    title="Add Project"
                    actions={actions}
                    open={this.state.isDialogOpen}
                    onRequestClose={this.handleRequestClose.bind(this)}>
                    <TextField
                        hintText="Project name"
                        onEnterKeyDown={this.onDialogSubmit.bind(this)}
                        ref="projectField"
                    />
                </Dialog>
            </div>
        );
    }
}

export default LeftPanel