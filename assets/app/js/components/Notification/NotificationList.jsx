import React, { PropTypes } from 'react';
import { List } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import NotificationItem from './NotificationItem.jsx';
import { toFuzzyTime } from '../../utils/general';

const propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  actions: React.PropTypes.shape({
    onMarkNotificationAsRead: PropTypes.func.isRequired,
    onAcceptProject: PropTypes.func.isRequired,
    onDeclineProject: PropTypes.func.isRequired,
  }),
};
const NotificationList = ({ notifications, users, actions }) => {
  const dispatchAcceptProject = (projectId, notifId) => {
    dispatch(acceptProject(projectId, notifId));
  };
  const dispatchDeclineProject = (projectId, notifId) => {
    dispatch(declineProject(projectId, notifId));
  };
  const notifsSortedByTime = notifications.sort((a, b) => (a.time < b.time));
  const notificationItems = notifsSortedByTime.map(notif => {
    const matchingUsers = users.filter(user => user.id === notif.meta.user_id);
    let user;
    if (matchingUsers.length > 0) {
      user = matchingUsers[0];
    }
    return (
      <NotificationItem
        key={notif.id}
        notification={notif}
        user={user}
        time={toFuzzyTime(notif.time)}
        actions={actions}
      />
    );
  });

  return (
    <List>
      {notificationItems}
    </List>

  );
};

NotificationList.propTypes = propTypes;
export default NotificationList;
