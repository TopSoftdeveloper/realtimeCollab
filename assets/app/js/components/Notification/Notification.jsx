import React, { Component, PropTypes } from 'react';

import NotificationList from './NotificationList.jsx';

class Notification extends Component {
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

Notification.propTypes = {
    notifications: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired
};

export default Notification;
