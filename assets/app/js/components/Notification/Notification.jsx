import React, { PropTypes } from 'react';

import NotificationList from './NotificationList.jsx';

const propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  actions: React.PropTypes.shape({
    onMarkNotificationAsRead: PropTypes.func.isRequired,
    onAcceptProject: PropTypes.func.isRequired,
    onDeclineProject: PropTypes.func.isRequired,
  }),
};

const Notification = ({ notifications, users, dispatch, actions }) => (
  <div className="main-content">
    <NotificationList
      notifications={notifications}
      dispatch={dispatch}
      users={users}
      actions={actions}
    />
  </div>
);

Notification.propTypes = propTypes;

export default Notification;
