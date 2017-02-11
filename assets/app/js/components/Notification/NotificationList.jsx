import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import NotificationItem from './NotificationItem.jsx';
import { toFuzzyTime } from '../../utils/general';
import { acceptProject, declineProject } from '../../actions/ReduxTaskActions';

const styles = {
  button: {
    margin: 5,
    height: 30,
  },
};
const propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const NotificationList = ({ notifications, users, dispatch }) => {
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
    let buttons;
    if (notif.type === 'INVITE_TO_PROJECT') {
      buttons = (
        <div className="notif-buttons">
          <RaisedButton
            style={styles.button}
            label="Accept"
            primary
            onTouchTap={dispatchAcceptProject.bind(null, notif.meta.project_id, notif.id)}
          />
          <RaisedButton
            style={styles.button}
            label="Decline"
            secondary
            onTouchTap={dispatchDeclineProject.bind(null, notif.meta.project_id, notif.id)}
          />
        </div>
      );
    }
    return (
      <NotificationItem
        key={notif.id}
        text={notif.text}
        read={notif.read}
        user={user}
        time={toFuzzyTime(notif.time)}
        actionButtons={buttons}
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
