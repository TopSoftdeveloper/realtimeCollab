import React, { PropTypes } from 'react';

import UserAvatar from '../Common/UserAvatar.jsx';
import { toFuzzyTime } from '../../utils/general';


const propTypes = {
  message: PropTypes.object.isRequired,
};

const SystemMssage = ({ message }) => (
  <li className="event-item">
    <div className="notif-photo">
      <UserAvatar
        displayName="system"
      />
    </div>
    <div>
      <span className="notif-text">{message.content}</span>
    </div>
    <span className="notif-fuzzy-time">{toFuzzyTime(message.created_at)}</span>
  </li>
);

SystemMssage.propTypes = propTypes;
export default SystemMssage;
