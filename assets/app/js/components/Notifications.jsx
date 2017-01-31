import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import vagueTime from 'vague-time'
import UserAvatar from './UserAvatar.jsx';
import {acceptProject, declineProject}  from '../actions/ReduxTaskActions'
import {getUserAvatar, toFuzzyTime} from '../utils/general'
import {Button} from 'react-bootstrap'

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

class NotificationList extends Component {
    render() {
        let notifsSortedByTime = this.props.notifs.sort(function(a, b) {
            return a.time < b.time
        })
        let notificationItems = notifsSortedByTime.map(notif => {
            let matchingUsers = this.props.users.filter(user => user.id === notif.meta.user_id)
            let user = null
            if (matchingUsers.length >= 1) {
                user = matchingUsers[0]
            }

            return <NotificationItem
                id={notif.id}
                key={notif.id}
                text={notif.text}
                type={notif.type}
                meta={notif.meta}
                read={notif.read}
                user={user}
                dispatch={this.props.dispatch}
                fuzzyTime={toFuzzyTime(notif.time)} />

            }
        );

        return (
            <div className='notification-list'>
                <ul>
                    {notificationItems}
                </ul>
            </div>
        );
    }
}

class Notifications extends Component {
    render() {
        const {notifications, dispatch, users} = this.props;
        return (
            <div className='main-content notif-container'>
                <h4>All Notifications</h4>
                <NotificationList
                    notifs={notifications}
                    dispatch={dispatch}
                    users={users}
                />
            </div>
        );
    }
}

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        notifications: state.notifications,
        users: state.users
    };
}


export default connect(mapStateToProps)(Notifications)
