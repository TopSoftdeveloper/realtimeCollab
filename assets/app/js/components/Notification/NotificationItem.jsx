import React, { Component, PropTypes } from 'react'
import {Button} from 'react-bootstrap'

import UserAvatar from '../UserAvatar.jsx';
import {acceptProject, declineProject}  from '../../actions/ReduxTaskActions'

class NotificationItem extends Component {
    acceptProject() {
        let notifId = this.props.id
        let projectId = this.props.meta.project_id
        this.props.dispatch(acceptProject(projectId, notifId))
    }

    declineProject() {
        let notifId = this.props.id
        let projectId = this.props.meta.project_id
        this.props.dispatch(declineProject(projectId, notifId))
    }

    render() {
        let buttons = null
        if (this.props.type === 'INVITE_TO_PROJECT') {
            buttons = (
                <div className="notif-buttons">
                    <Button onClick={this.acceptProject.bind(this)}>Accept</Button>
                    <Button onClick={this.declineProject.bind(this)}>Decline</Button>
                </div>
            )
        }
        let notifClassName = 'notif-item'
        if (this.props.read) {
            notifClassName += ' notif-read'
        } else {
            notifClassName += ' notif-unread'
        }

        let image = null
        if (this.props.user) {
            image = (
              <UserAvatar
                imgSrc={this.props.user.display_image}
                displayName={this.props.user.display_name}
              />
            );
        }

        return (
            <li className={notifClassName}>
                <div className="notif-photo">
                    {image}
                </div>
                <div>
                    <span className='notif-text'>{this.props.text}</span>
                </div>
                <span className='notif-fuzzy-time'>{this.props.fuzzyTime}</span>
                {buttons}
            </li>
        );
    }
}
export default NotificationItem;
