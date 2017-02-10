import React, { PropTypes } from 'react';

import NotificationItem from './NotificationItem.jsx';
import { toFuzzyTime } from '../../utils/general';

const propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const NotificationList = ({ notifications, users, dispatch }) => {
  const notifsSortedByTime = notifications.sort((a, b) => (a.time < b.time));
  const notificationItems = notifsSortedByTime.map(notif => {
    const matchingUsers = users.filter(user => user.id === notif.meta.user_id);
    let user = null;
    if (matchingUsers.length >= 1) {
      user = matchingUsers[0];
    }
    return (
      <NotificationItem
        id={notif.id}
        key={notif.id}
        text={notif.text}
        type={notif.type}
        meta={notif.meta}
        read={notif.read}
        user={user}
        dispatch={dispatch}
        fuzzyTime={toFuzzyTime(notif.time)}
      />
    );
  });

  return (
    <div className="notification-list">
      <ul>
        {notificationItems}
      </ul>
    </div>
  );
};

NotificationList.propTypes = propTypes;
export default NotificationList;
