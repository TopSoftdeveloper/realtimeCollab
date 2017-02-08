import React, { PropTypes } from 'react';
import _ from 'lodash';

import EventItem from './EventItem.jsx';
import templates from '../../../../../server/templates.js';

const propTypes = {
  events: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

const EventList = ({ events, users }) => {
  let eventItems = events.map(event => {
    if (!event.data) return null;
    const data = JSON.parse(event.data);
    let targetUser = users.filter(user => user.id === data.user_id);
    if (!_.isEmpty(targetUser)) {
      targetUser = _.first(targetUser);
      data.displayName = targetUser.display_name;
    } else {
      return null;
    }

    const item = {
      message: templates.getMessage(event.template, data),
      created_at: event.created_at,
      displayName: targetUser.display_name,
      avatarUrl: targetUser.display_image,
    };
    return <EventItem key={event.id} event={item} />;
  });

  if (_.isEmpty(eventItems)) {
    eventItems = (
      <div className="no-items">
        <h3>No recent activity!</h3>
      </div>
    );
  }

  return (
    <div className="event-list">
      <ul>
        {eventItems}
      </ul>
    </div>
  );
};

EventList.propTypes = propTypes;
export default EventList;
