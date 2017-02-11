import React, { PropTypes } from 'react';

import UserAvatar from '../Common/UserAvatar.jsx';
import { toFuzzyTime } from '../../utils/general';


const propTypes = {
  event: PropTypes.object.isRequired,
};

const EventItem = ({ event }) => (
  <li className="event-item">
    <div className="notif-photo">
      <UserAvatar
        imgSrc={event.avatarUrl}
        displayName={event.displayName}
      />
    </div>
    <div>
      <span className="notif-text">{event.message}</span>
    </div>
    <span className="notif-fuzzy-time">{toFuzzyTime(event.created_at)}</span>
  </li>
);

EventItem.propTypes = propTypes;
export default EventItem;
