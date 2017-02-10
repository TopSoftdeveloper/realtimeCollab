import React, { PropTypes } from 'react';

import NotificationList from './NotificationList.jsx';

const propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const Notification = ({ notifications, users, dispatch }) => (
  <div className="main-content notif-container">
    <h4>All Notifications</h4>
    <NotificationList
      notifications={notifications}
      dispatch={dispatch}
      users={users}
    />
  </div>
);

Notification.propTypes = propTypes;

export default Notification;
