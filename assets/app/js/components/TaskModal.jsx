import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/select-field';

class TaskModal extends Component {

    constructor(props, context) {
        super(props, context);
        if (this.props.assignee) {
            this.state = {
                assignee: this.props.assignee
            }
        } else {
            this.state = {
                assignee: 0
            }
        }
    }

    onDialogSubmit() {
        let content = this.refs.taskField.getValue().trim()
        if (content !== '') {
            this.props.taskMethod(content, this.state.assignee)
        }
        this.props.handleClose()
    }

    handleChange(event, index, value) {
        this.setState({assignee: value});
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


        let possibleAssignees = this.props.users.map(user => {
            return <MenuItem value={user.id} key={user.id} primaryText={user.display_name}/>
        })

        possibleAssignees.unshift(<MenuItem value={0} key={0} primaryText="None"/>)

        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                onRequestClose={this.props.handleClose}
                open={this.props.open}>
                <TextField
                    hintText="Task name"
                    onEnterKeyDown={this.onDialogSubmit.bind(this)}
                    ref="taskField"
                    defaultValue={this.props.content}
                />
                <br/>
                <SelectField
                    value={this.state.assignee}
                    onChange={this.handleChange.bind(this)}
                    floatingLabelText="Assign to">
                    {possibleAssignees}
                </SelectField>
            </Dialog>
        )
    }
}

export default TaskModal