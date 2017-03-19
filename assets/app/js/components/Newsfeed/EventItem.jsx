import React, { PropTypes } from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import { toFuzzyTime } from '../../utils/general';


const styles = {
  cardContainer: {
    shadowColor: 'transparent',
    boxShadow: 'none',
    marginBottom: 0,
    borderWidth: 0,
  },
};
const propTypes = {
  event: PropTypes.object.isRequired,
};

const EventItem = ({ event }) => (
  <div>
    <Card
      style={styles.cardContainer}
    >
      <CardHeader
        actAsExpander
        title={event.message}
        subtitle={toFuzzyTime(event.created_at)}
        avatar={event.avatarUrl && <Avatar src={event.avatarUrl} />}
      />
    </Card>
    <Divider />
  </div>
);

EventItem.propTypes = propTypes;
export default EventItem;
