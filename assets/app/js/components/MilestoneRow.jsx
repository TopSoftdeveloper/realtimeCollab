import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu, Dialog, TextField, FlatButton } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/select-field';
import TaskModal from './TaskModal.jsx'

class MilestoneRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false
        }
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    onSubmit() {
        this.setState({
            isDialogOpen: false
        })
    }

    deleteMilestone() {
        this.props.onDeleteMilestone()
    }

    render() {
        let iconButtonElement = <IconButton><MoreVert /></IconButton>
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

        let possibleAssignees = this.props.users.map(user => {
            return <MenuItem value={user.id} key={user.id} primaryText={user.display_name}/>
        })

        possibleAssignees.unshift(<MenuItem value={0} key={0} primaryText="None"/>)

        return (
            <div className="milestone-row">
                <h3 className="milestone-header">{this.props.milestone}</h3>
                    {iconMenu}
                <div className="clearfix"></div>
                <p>{deadlineText}</p>
                <TaskModal
                    title="Add Task"
                    open={this.state.isDialogOpen}
                    onSubmit={this.onSubmit.bind(this)}
                    onAddTask={this.props.onAddTask}
                    users={this.props.users}
                />
            </div>
        )
    }
}

export default MilestoneRow