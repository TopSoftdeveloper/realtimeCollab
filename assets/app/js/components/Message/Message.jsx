import React, { Component, PropTypes } from 'react';
import MessageList from './MessageList.jsx';

const propTypes = {
  // props passed by parents
  milestoneId: PropTypes.string,
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
          messages={messages}
          users={users}
        />
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
