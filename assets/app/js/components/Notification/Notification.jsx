import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import NotificationList from './NotificationList.jsx';
import myTheme from '../../myTheme.js';

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

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
  },
  titleContainer: {
    flex: '0 1 auto',
  },
  notificationListContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
};

const Notification = ({ notifications, users, dispatch, actions }) => {
  const unreadCount = notifications.filter(notif => !notif.read).length;
  return (
    <div className="main-content" style={styles.container}>
      <div style={styles.titleContainer}>
        <h2 style={{ color: myTheme.palette.primary1Color }}>
          Notifications
          {unreadCount > 0 &&
            <Subheader style={{ display: 'inline-block', width: 'auto' }}>
              You have&nbsp;
              <span style={{ color: myTheme.palette.primary1Color }}>
                {unreadCount}
              </span> unread notification{unreadCount > 1 ? 's' : ''}
            </Subheader>
          }
        </h2>
      </div>
      {notifications.length > 0 ?
        <Paper style={styles.notificationListContainer}>
          <NotificationList
            notifications={notifications}
            dispatch={dispatch}
            users={users}
            actions={actions}
          />
        </Paper> :
        <div className="no-items">
          <h3>No recent notification!</h3>
        </div>
      }

    </div>
  );
};

Notification.propTypes = propTypes;

export default Notification;
