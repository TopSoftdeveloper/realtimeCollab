import React, { Component, PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import PostMessageInput from './PostMessageInput.jsx';
import MessageList from './MessageList.jsx';

const propTypes = {
  // props passed by container
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  currentProject: PropTypes.object.isRequired,
  onPostNewMessage: PropTypes.func.isRequired,
  // props passed by parents
  milestoneId: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
};
const styles = {
  titleContainer: {
    fontSize: 18,
    backgroundColor: 'rgb(232, 232, 232)',
  },
  closeIconContainer: {
    fontSize: 20,
    paddingRight: 5,
    paddingTop: 5,
    float: 'right',
  },
  inputContainer: {
    padding: 10,
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
        <Subheader style={styles.titleContainer}>
          <span>Discussion on <b>{this.props.title}</b></span>
          <IconButton
            style={styles.closeIconContainer}
            onTouchTap={this.onClickDismissButton}
          >
            <i className="material-icons">clear</i>
          </IconButton>
        </Subheader>
        <div style={styles.contentContainer}>
          <MessageList
            messages={filteredMessages}
            users={users}
          />
        </div>
        <Divider />
        <div style={styles.inputContainer}>
          <PostMessageInput
            projectId={this.props.currentProject.id}
            milestoneId={this.props.milestoneId}
            authorId={this.props.users.filter(user => user.me)[0].id}
            onPostNewMessage={this.props.onPostNewMessage}
          />
        </div>
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
