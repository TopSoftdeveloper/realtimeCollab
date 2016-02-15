import React, { Component } from 'react'
import OnlineUsers from '../components/OnlineUsers.jsx'
import {getCurrentProject} from '../utils/general'
import { IconButton, Dialog, TextField, FlatButton } from 'material-ui'
import $ from 'jquery'
var AppConstants = require('../AppConstants')


class ProjectHeader extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            isDialogOpen: false,
            isHangoutBtnRendered: false
        }
    }

    componentDidUpdate() {
        if (!this.state.isHangoutBtnRendered && $('#hangouts-btn-placeholder').length) {
            gapi.hangout.render('hangouts-btn-placeholder', { 'render': 'createhangout' });
            this.setState({
                isHangoutBtnRendered: true
            })
        }
    }

    handleRequestClose(buttonClicked) {
        if (!buttonClicked && this.state.openDialogStandardActions) return
        this.setState({
            isDialogOpen: false
        })
    }
    onDialogSubmit() {
        let content = this.refs.milestoneField.getValue().trim()
        if (content !== '') {
            this.addMilestone(content)
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

    addMilestone(content) {
        this.props.actions.createMilestone({
            id: _.uniqueId('milestone'),
            content: content,
            deadline: null,
            project_id: getCurrentProject(),
            tasks: []
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

        if (this.props.projectName) {
            return (
                <div className="project-header header-color clearfix">
                    <h3 className='project-header-text header-text'>{this.props.projectName} </h3>
                    <i className="material-icons add-milestone-btn"
                       onClick={this.openModal.bind(this)}>add</i>
                    <div id="hangouts-btn-wrapper">
                        <div id="hangouts-btn-placeholder"></div>
                    </div>
                    <Dialog
                        title="Add Milestone"
                        actions={actions}
                        open={this.state.isDialogOpen}
                        onRequestClose={this.handleRequestClose.bind(this)}>
                        <TextField
                            hintText="Milestone name"
                            onEnterKeyDown={this.onDialogSubmit.bind(this)}
                            ref="milestoneField"
                        />
                    </Dialog>
                    <OnlineUsers members={this.props.members} />
                </div>
            )
        } else if(window.location.href === AppConstants.APP_ROOT_URL + '/notifications') {
            return (
                <div className="project-header header-color clearfix">
                    <h3 className='project-header-text header-text'>Notifications</h3>
                </div>
            )
        } else {
            return (
                <div className="project-header header-color clearfix">
                    <h3 className='project-header-text header-text'></h3>
                </div>
            )
        }

    }
}

export default ProjectHeader