import React, { Component, PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import MessageList from './MessageList.jsx';

const propTypes = {
  // props passed by container
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  // props passed by parents
  milestoneId: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
};
const styles = {
  closeIconContainer: {
    fontSize: 20,
    paddingRight: 5,
    paddingTop: 5,
    float: 'right',
  },
};
class Message extends Component {
  constructor(props, context) {
    super(props, context);
    this.onClickDismissButton = this.onClickDismissButton.bind(this);
  }
  onClickDismissButton() {
    this.props.onDismiss();
  }
  render() {
    const { messages, users, milestoneId } = this.props;
    const filteredMessages = messages.filter(message =>
      milestoneId === null || message.milestone_id === milestoneId);
    return (
      <div>
        <Subheader>
          <span>Discussion on <b>{this.props.title}</b></span>
          <IconButton
            style={styles.closeIconContainer}
            onTouchTap={this.onClickDismissButton}
          >
            <i className="material-icons">clear</i>
          </IconButton>
        </Subheader>
        <Divider />
        <MessageList
          messages={filteredMessages}
          users={users}
        />
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
