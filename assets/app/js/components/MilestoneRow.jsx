import React, { Component } from 'react'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import { IconButton, IconMenu } from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import SelectField from 'material-ui/lib/select-field';
import TaskModal from './TaskModal.jsx'
import MilestoneModal from './MilestoneModal.jsx'
import { bindActionCreators } from 'redux'
import * as SocketActions from '../actions/SocketActions'
import { connect } from 'react-redux'

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

    openMilestoneModal(id) {
        this.setState({
            milestoneDialog: true
        })
        const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
        socketActions.userIsEditing('milestone', id)
    }

    handleMilestoneClose(id) {
        this.setState({
            milestoneDialog: false
        })
        const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
        socketActions.userStopsEditing('milestone', id)
    }

    editMilestone(content, deadline) {
        this.props.onEditMilestone(content, deadline)
    }


    render() {
        let iconButtonElement = <IconButton><MoreVert /></IconButton>
        let iconMenu = null

        // ICON MENU
        if (this.props.onDeleteMilestone && this.props.milestone.id) { // Not "Uncategorized"
            iconMenu = <IconMenu
                className="more-vert-btn"
                iconButtonElement={iconButtonElement}
                openDirection="bottom-right">
                <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
                <MenuItem primaryText="Edit Milestone" onClick={this.openMilestoneModal.bind(this, this.props.milestone.id)}/>
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

        // DEADLINE
        let deadlineText = null
        if (this.props.milestone.deadline) {
            let eventTime = new Date(this.props.milestone.deadline)
            let options = {year: 'numeric', month: 'long', day: 'numeric' }
            deadlineText = 'Due by ' + eventTime.toLocaleDateString('en-US', options)
        }

        // ASSIGNEES
        let possibleAssignees = this.props.users.map(user => {
            return <MenuItem value={user.id} key={user.id} primaryText={user.display_name}/>
        })

        possibleAssignees.unshift(<MenuItem value={0} key={0} primaryText="None"/>)

        // EDITING INDICATOR
        let editIndicator = null
        let listStyle = {}

        if (this.props.milestone.editing) {
            let editor = this.props.users.filter(user => user.id === this.props.milestone.edited_by)[0]
            if (editor && editor.online) {
                let divStyle = {
                    float: 'right',
                    fontSize: 'smaller',
                    color: 'white',
                    background: editor.colour,
                    fontWeight: 'bold'
                }

                editIndicator =
                    <div style={divStyle}>{editor.display_name} is editing</div>
                listStyle = {
                    borderStyle: 'solid',
                    borderColor: editor.colour
                }
            }
        }

        return (
            <div className="milestone-row" style={listStyle}>
                {editIndicator}
                <h3 className="milestone-header">{this.props.milestone.content}</h3>
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
                    handleClose={this.handleMilestoneClose.bind(this, this.props.milestone.id)}
                    method={this.editMilestone.bind(this)}
                    deadline={this.props.milestone.deadline}
                    content={this.props.milestone.content}
                />
            </div>
        )
    }
}

export default connect()(MilestoneRow)