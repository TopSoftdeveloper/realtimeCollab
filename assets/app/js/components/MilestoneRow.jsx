import React, { Component } from 'react'
import MoreVert from './../icons/MoreVert.jsx'
import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
const MenuItem = require('material-ui/lib/menus/menu-item'); // use menu item from this path

class MilestoneRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false
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

        return (
            <div className="milestone-row">
                <h3 className="milestone-header">{this.props.milestone}</h3>
                    {iconMenu}
                <div className="clearfix"></div>

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
                </Dialog>
            </div>
        )
    }
}

export default MilestoneRow