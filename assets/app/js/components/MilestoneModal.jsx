import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'

class MilestoneModal extends Component {

    constructor(props, context) {
        super(props, context);
    }

    onDialogSubmit() {
        let content = this.refs.milestoneField.getValue().trim()
        if (content !== '') {
            this.props.method(content, this.state.deadline)
        }
        this.props.handleClose()
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
            <Dialog
                title={this.props.title}
                actions={actions}
                onRequestClose={this.props.handleClose}
                open={this.props.open}>
                <TextField
                    hintText="Milestone name"
                    onEnterKeyDown={this.onDialogSubmit.bind(this)}
                    ref="milestoneField"
                    defaultValue={this.props.content}
                />
                <br/>
            </Dialog>
        )
    }
}

export default MilestoneModal