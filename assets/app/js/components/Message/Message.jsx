import React, { Component, PropTypes } from 'react';
import MessageList from './MessageList.jsx';

const propTypes = {
  // props passed by parents
  milestoneId: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  // props passed by container
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
};

class Message extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { messages, users } = this.props;
    return (
      <div>
        <br />
        <MessageList
          events={events}
          users={users}
        />
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
