import React, { Component } from 'react'
import AvatarList from './AvatarList.jsx'
import {getCurrentProject} from '../utils/general'
import { IconButton, Dialog, TextField, FlatButton } from 'material-ui'
import $ from 'jquery'
import MilestoneModal from './MilestoneModal.jsx'
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

    handleClose() {
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
        let onlineUsers = this.props.members.filter(member => {
            return (member.online && member.id !== localStorage.getItem('user_id'))                        
        });

        if (this.props.projectName) {
            return (
                <div className="project-header header-color clearfix">
                    <h3 className='project-header-text header-text'>{this.props.projectName} </h3>
                    <i className="material-icons add-milestone-btn"
                       onClick={this.openModal.bind(this)}>add</i>
                    <div id="hangouts-btn-wrapper">
                        <div id="hangouts-btn-placeholder"></div>
                    </div>
                    <MilestoneModal
                        title="Add Milestone"
                        open={this.state.isDialogOpen}
                        handleClose={this.handleClose.bind(this)}
                        method={this.addMilestone.bind(this)}
                    />
                    <AvatarList className="online-users" members={onlineUsers} />
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