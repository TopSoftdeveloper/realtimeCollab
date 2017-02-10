import React, { PropTypes } from 'react';

import UserAvatar from '../UserAvatar.jsx';

const propTypes = {
  text: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  time: PropTypes.string.isRequired,
  user: PropTypes.object,
  actionButtons: PropTypes.object,
};

const NotificationItem = ({ text, read, time, user, actionButtons }) => {
  let notifClassName = 'notif-item';
  if (read) {
    notifClassName += ' notif-read';
  } else {
    notifClassName += ' notif-unread';
  }

  return (
    <li className={notifClassName}>
      <div className="notif-photo">
        {user &&
          <UserAvatar
            imgSrc={user.display_image}
            displayName={user.display_name}
          />
        }
      </div>
      <div>
        <span className="notif-text">{text}</span>
      </div>
      <span className="notif-fuzzy-time">{time}</span>
      {actionButtons}
    </li>
  );
};

NotificationItem.propTypes = propTypes;
export default NotificationItem;
