import React, { PropTypes } from 'react';
import _ from 'lodash';

import EventItem from './EventItem.jsx';
import templates from '../../../../../server/templates.js';

const propTypes = {
  events: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

const EventList = ({ events, users }) => {
  let content = (
    <div className="no-items">
      <h3>No recent activity!</h3>
    </div>
  );
  const eventItems = [];
  events.forEach(event => {
    if (event.data) {
      const data = JSON.parse(event.data);
      let targetUser = users.filter(user => user.id === data.user_id);
      if (targetUser.length > 0) {
        targetUser = _.first(targetUser);
        data.displayName = targetUser.display_name;

        const item = {
          message: templates.getMessage(event.template, data),
          created_at: event.created_at,
          displayName: targetUser.display_name,
          avatarUrl: targetUser.display_image,
        };
        eventItems.push(<EventItem key={event.id} event={item} />);
      }
    }
  });

  if (eventItems.length > 0) {
    content = eventItems;
  }

  return (
    <div className="event-list">
      <ul>
        {content}
      </ul>
    </div>
  );
};

EventList.propTypes = propTypes;
export default EventList;
