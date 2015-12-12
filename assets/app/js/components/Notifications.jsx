import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import vagueTime from 'vague-time'
import {acceptProject}  from '../actions/ReduxTaskActions'

class NotificationItem extends Component {
    acceptProject() {
        let notifId = this.props.id
        let projectId = this.props.meta.project_id
        this.props.dispatch(acceptProject(projectId, notifId))
    }

    render() {
        let buttons = null
        if (this.props.type === 'INVITE_TO_PROJECT') {
            buttons = (
                <div>
                    <button className="btn" onClick={this.acceptProject.bind(this)}>Accept</button>
                </div>
            )
        }

        let background = 'paleTurquoise'
        if (this.props.read) {
            background = 'white'
        }

        return (
            <li className='notif-item' style={{backgroundColor: background}}>
                <div>
                    <span className='notif-text'>{this.props.text}</span>
                    {buttons}
                </div>
                <span className='notif-fuzzy-time'>{this.props.fuzzyTime}</span>
            </li>
        );
    }
}

class NotificationList extends Component {
    toFuzzyTime(time) {
        return vagueTime.get({
            to: new Date(time).getTime()/1000, // convert ISO UTC to seconds from epoch
            units: 's'
        })
    }

    render() {
        let notificationItems = this.props.notifs.map(notif => 
            <NotificationItem
                id={notif.id}
                key={notif.id} 
                text={notif.text}
                type={notif.type}
                meta={notif.meta}
                read={notif.read}
                dispatch={this.props.dispatch}
                fuzzyTime={this.toFuzzyTime(notif.time)} />
        );

        return (
            <div className='notification-container'>
                <div className='notification-list'>
                    <ul>
                        {notificationItems}             
                    </ul>         
                </div>
            </div>
        );
    }
}

class Notifications extends Component {    
    render() {
        const {notifications, dispatch} = this.props;

        return (
            <div>
                <h3>All Notifications</h3>  
                <NotificationList notifs={notifications} dispatch={this.props.dispatch} />
            </div>            
        );
    }
}

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}


export default connect(mapStateToProps)(Notifications)