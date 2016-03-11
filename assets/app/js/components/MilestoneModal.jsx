import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Toggle from 'material-ui/lib/toggle';

const styles = {
    marginBottom: 16,
    maxWidth: 250
}

class MilestoneModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            deadline: null,
            toggle: true
        }
    }

    onDialogSubmit() {
        let content = this.refs.milestoneField.getValue().trim()
        let newDate = new Date(this.state.deadline)
        let isoDate  = null
        if (this.state.toggle && new Date().getTime() < newDate.getTime()) { // deadline must be after current time
            isoDate = newDate.toISOString()
        }
        if (content !== '') {
            this.props.method(content, isoDate)
        }
        this.props.handleClose()
        this.setState({
            deadline: null
        })
    }

    formatDate(date) {
        let options = {year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('en-US', options)
    }

    toggleDeadline(e, status) {
        if (!status) {
            this.setState({
                deadline: null
            })
        }
        this.setState({
            toggle: status
        })
    }

    onDateChange(first, newDate) {
        //Since there is no particular event associated with the change
        //the first argument will always be null and the
        //second argument will be the new Date instance.
        this.setState({
            deadline: newDate
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
                <br/>
                <Toggle
                    label="Deadline"
                    style={styles}
                    onToggle={this.toggleDeadline.bind(this)}
                    defaultToggled={this.state.toggle}
                />
                <DatePicker
                    hintText="Select a date"
                    autoOk={true}
                    formatDate={this.formatDate.bind(this)}
                    onChange={this.onDateChange.bind(this)}
                    disabled={!this.state.toggle}
                />
            </Dialog>
        )
    }
}

export default MilestoneModal