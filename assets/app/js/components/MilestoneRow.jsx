import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';

import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item';
//import AutoComplete from 'material-ui/lib/auto-complete';
import SelectField from 'material-ui/lib/select-field';

const colors = [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Black',
    'White'
];

const customContentStyle = {
    overflowY: 'visible',
    overflowX: 'visible'
}

class MilestoneRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false,
            value: 2
        }
    }

    handleRequestClose(buttonClicked) {
        if (!buttonClicked && this.state.openDialogStandardActions) return;
        this.setState({
            isDialogOpen: false
        });
    }
    onDialogSubmit() {
        let content = this.refs.taskField.getValue().trim()
        if (content !== '') {
            this.props.onAddTask(content)
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

    deleteMilestone() {
        this.props.onDeleteMilestone()
    }
    handleChange(event, index, value) {
        this.setState({value});
    }

    render() {
        let iconButtonElement = <IconButton><MoreVert /></IconButton>
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

        let iconMenu = null
        if (this.props.onDeleteMilestone) {
            iconMenu = <IconMenu
                className="more-vert-btn"
                iconButtonElement={iconButtonElement}
                openDirection="bottom-right">
                <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
                <MenuItem primaryText="Delete Milestone" onClick={this.deleteMilestone.bind(this)}/>
            </IconMenu>
        } else {
            iconMenu = <IconMenu
                className="more-vert-btn"
                iconButtonElement={iconButtonElement}
                openDirection="bottom-right">
                <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
            </IconMenu>
        }

        let deadlineText = null
        if (this.props.deadline) {
            let eventTime = new Date(this.props.deadline)
            let options = {year: 'numeric', month: 'long', day: 'numeric' }
            deadlineText = 'Due by ' + eventTime.toLocaleDateString('en-US', options)
        }

        return (
            <div className="milestone-row">
                <h3 className="milestone-header">{this.props.milestone}</h3>
                    {iconMenu}
                <div className="clearfix"></div>
                <p>{deadlineText}</p>

                <Dialog
                    title="Add Task"
                    actions={actions}
                    open={this.state.isDialogOpen}
                    onRequestClose={this.handleRequestClose.bind(this)}>
                    <TextField
                        hintText="Task name"
                        onEnterKeyDown={this.onDialogSubmit.bind(this)}
                        ref="taskField"
                    />
                    <br/>

                    <SelectField value={this.state.value} onChange={this.handleChange.bind(this)}>
                        <MenuItem value={1} primaryText="Never"/>
                        <MenuItem value={2} primaryText="Every Night"/>
                        <MenuItem value={3} primaryText="Weeknights"/>
                        <MenuItem value={4} primaryText="Weekends"/>
                        <MenuItem value={5} primaryText="Weekly"/>
                    </SelectField>
                </Dialog>
            </div>
        )
    }
}

export default MilestoneRow