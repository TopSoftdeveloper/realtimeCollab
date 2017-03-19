import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import EventList from './EventList.jsx';

const propTypes = {
  // props passed by parents

  // props passed by container
  users: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
};

class Newsfeed extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { events, users } = this.props;
    return (
      <EventList
        events={events}
        users={users}
      />
    );
  }
}

Newsfeed.propTypes = propTypes;
export default Newsfeed;
