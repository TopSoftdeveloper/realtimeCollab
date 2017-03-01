import React, { PropTypes } from 'react';

import UserAvatar from '../Common/UserAvatar.jsx';
import { toFuzzyTime } from '../../utils/general';


const propTypes = {
  message: PropTypes.object.isRequired,
};

const UserMessage = ({ message }) => (
  <li className="event-item">
    <div className="notif-photo">
      <UserAvatar
        imgSrc={message.authorAvatarUrl}
        displayName={message.authorName}
      />
    </div>
    <div>
      <span className="notif-text">{message.content}</span>
    </div>
    <span className="notif-fuzzy-time">{toFuzzyTime(message.created_at)}</span>
  </li>
);

UserMessage.propTypes = propTypes;
export default UserMessage;
