import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/select-field';
import TaskModal from './TaskModal.jsx'
import MilestoneModal from './MilestoneModal.jsx'

class MilestoneRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false,
            milestoneDialog: false
        }
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    handleClose() {
        this.setState({
            isDialogOpen: false
        })
    }

    deleteMilestone() {
        this.props.onDeleteMilestone()
    }

    openMilestoneModal() {
        this.setState({
            milestoneDialog: true
        })
    }

    handleMilestoneClose() {
        this.setState({
            milestoneDialog: false
        })
    }

    editMilestone(content, deadline) {
        this.props.onEditMilestone(content, deadline)
    }


    render() {
        let iconButtonElement = <IconButton><MoreVert /></IconButton>
        let iconMenu = null
        if (this.props.onDeleteMilestone && this.props.id) { // Not "Uncategorized"
            iconMenu = <IconMenu
                className="more-vert-btn"
                iconButtonElement={iconButtonElement}
                openDirection="bottom-right">
                <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
                <MenuItem primaryText="Edit Milestone" onClick={this.openMilestoneModal.bind(this)}/>
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
                <h3 className="milestone-header">{this.props.content}</h3>
                    {iconMenu}
                <div className="clearfix"></div>
                <p>{deadlineText}</p>
                <TaskModal
                    title="Add Task"
                    open={this.state.isDialogOpen}
                    handleClose={this.handleClose.bind(this)}
                    taskMethod={this.props.onAddTask}
                    users={this.props.users}
                />
                <MilestoneModal
                    title="Edit Milestone"
                    open={this.state.milestoneDialog}
                    handleClose={this.handleMilestoneClose.bind(this)}
                    method={this.editMilestone.bind(this)}
                    deadline={this.props.deadline}
                    content={this.props.content}
                />
            </div>
        )
    }
}

export default MilestoneRow