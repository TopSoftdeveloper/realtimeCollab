import React, { PropTypes } from 'react';
import _ from 'lodash';

import UserMessage from './UserMessage.jsx';
import SystemMessage from './SystemMessage.jsx';

const propTypes = {
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};
const styles = {
  emptyContainer: {
    color: '#aaaaaa',
    left: '50%',
    textAlign: 'center',
  },
};
const MessageList = ({ messages, users }) => {
  let content = (
    <div style={styles.emptyContainer}>
      <h3>Post some messages!</h3>
    </div>
  );
  const messageItems = [];
  messages.forEach(message => {
    if (message.author_id) {
      let targetUser = users.filter(user => user.id === message.author_id);
      if (targetUser.length > 0) {
        targetUser = _.first(targetUser);
        const messageItem = {
          pinned: message.pinned,
          content: message.content,
          created_at: message.created_at,
          authorName: targetUser.display_name,
          authorAvatarUrl: targetUser.display_image,
        };
        messageItems.push(<UserMessage key={message.id} message={messageItem} />);
      }
    } else {
      const messageItem = {
        content: message.content,
        created_at: message.created_at,
      };
      messageItems.push(<SystemMessage key={message.id} message={messageItem} />);
    }
  });

  if (messageItems.length > 0) {
    content = messageItems;
  }

  return (
    <div className="event-list">
      <ul>
        {content}
      </ul>
    </div>
  );
};

MessageList.propTypes = propTypes;
export default MessageList;
