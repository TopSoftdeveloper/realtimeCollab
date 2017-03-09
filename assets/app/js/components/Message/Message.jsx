import React, { Component, PropTypes } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import MessageModal from './MessageModal.jsx';
import MessageList from './MessageList.jsx';

const propTypes = {
  // props passed by container
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  currentProject: PropTypes.object.isRequired,
  actions: React.PropTypes.shape({
    onPostNewMessage: PropTypes.func.isRequired,
    onPinMessage: PropTypes.func.isRequired,
    onUnpinMessage: PropTypes.func.isRequired,
    onEditMessageContent: PropTypes.func.isRequired,
  }),
  // props passed by parents
  milestoneId: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
};
const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    overflowY: 'auto',
  },
  titleContainer: {
    flex: '0 1 auto',
    fontSize: 18,
    backgroundColor: 'rgb(232, 232, 232)',
  },
  messageListContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  bottomPanelContainer: {
    flex: '0 1 40px',
    padding: 10,
  },
  closeIconContainer: {
    fontSize: 20,
    paddingRight: 5,
    paddingTop: 5,
    float: 'right',
  },
  contentContainer: {
  },
  emptyContainer: {
    color: '#aaaaaa',
    left: '50%',
    textAlign: 'center',
  },
};
class Message extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSystemActivity: true,
      showUserMessage: true,
      isPostNewMessageMode: false,
    };
    this.onClickDismissButton = this.onClickDismissButton.bind(this);
    this.toggleSystemActivity = this.toggleSystemActivity.bind(this);
    this.toggleUserMessage = this.toggleUserMessage.bind(this);
    this.postNewMessage = this.postNewMessage.bind(this);
    this.onEnterEditMode = this.onEnterEditMode.bind(this);
    this.onLeaveEditMode = this.onLeaveEditMode.bind(this);
  }
  onClickDismissButton() {
    this.props.onDismiss();
  }
  onEnterEditMode() {
    this.setState({
      isPostNewMessageMode: true,
    });
  }
  onLeaveEditMode() {
    this.setState({
      isPostNewMessageMode: false,
    });
  }
  toggleUserMessage() {
    this.setState({
      showUserMessage: !this.state.showUserMessage,
    });
  }
  toggleSystemActivity() {
    this.setState({
      showSystemActivity: !this.state.showSystemActivity,
    });
  }
  postNewMessage(content) {
    const message = {
      pinned: false,
      content,
      author_id: this.props.users.filter(user => user.me)[0].id,
      project_id: this.props.currentProject.id,
      milestone_id: this.props.milestoneId,
    };
    this.props.actions.onPostNewMessage(message);
  }
  renderInfoButtons(milestoneMessages) {
    const userMessages = milestoneMessages.filter(message => message.author_id);
    const systemActivity = milestoneMessages.filter(message => !message.author_id);
    const userMessagesText =
      `${userMessages.length} ${userMessages.length > 1 ? 'Messages' : 'Message'}`;
    const systemActivityText =
      `${systemActivity.length} ${systemActivity.length > 1 ? 'Activities' : 'Activity'}`;
    const messageLabelStyle = {
      opacity: this.state.showUserMessage ? 1 : 0.5,
      fontSize: 12,
    };
    const activityLabelStyle = {
      opacity: this.state.showSystemActivity ? 1 : 0.5,
      fontSize: 12,
    };
    return (
      <div>
        <FlatButton
          labelStyle={messageLabelStyle}
          label={userMessagesText}
          secondary
          onTouchTap={this.toggleUserMessage}
        />
        <FlatButton
          labelStyle={activityLabelStyle}
          label={systemActivityText}
          primary
          onTouchTap={this.toggleSystemActivity}
        />
      </div>
    );
  }
  renderMessageList(milestoneMessages) {
    const filteredMessages = milestoneMessages.filter(message => (
      (this.state.showSystemActivity && !message.author_id) ||
        (this.state.showUserMessage && message.author_id)
    ));
    if (milestoneMessages.length > 0) {
      return (
        <div style={styles.contentContainer}>
          <MessageList
            actions={this.props.actions}
            messages={filteredMessages}
            users={this.props.users}
          />
        </div>
      );
    }
    return (
      <div style={styles.emptyContainer}>
        <h3>Post some messages!</h3>
      </div>
    );
  }
  renderPinnedMessageList(milestoneMessages) {
    const pinnedMessages = milestoneMessages.filter(message => message.pinned);
    return (pinnedMessages.length > 0 &&
      <div>
        <Subheader>Pinned Messages: </Subheader>
        <MessageList
          actions={this.props.actions}
          messages={pinnedMessages}
          users={this.props.users}
        />
      </div>

    );
  }
  renderbottomPanel() {
    return (!this.state.isPostNewMessageMode ?
      <RaisedButton
        secondary
        label="New Comment"
        onTouchTap={this.onEnterEditMode}
      /> :
      <MessageModal
        onSubmitMethod={this.postNewMessage}
        onCloseMethod={this.onLeaveEditMode}
      />
    );
  }
  render() {
    const { messages, milestoneId } = this.props;
    const milestoneMessages = messages.filter(message =>
      message.milestone_id === milestoneId);
    return (
      <div style={styles.container}>
        <Subheader style={styles.titleContainer}>
          <span><b>{this.props.title}</b></span>
          <IconButton
            style={styles.closeIconContainer}
            onTouchTap={this.onClickDismissButton}
          >
            <i className="material-icons">clear</i>
          </IconButton>
        </Subheader>
        <div style={styles.messageListContainer}>
          {this.renderPinnedMessageList(milestoneMessages)}
          {this.renderInfoButtons(milestoneMessages)}
          {this.renderMessageList(milestoneMessages)}
        </div>

        <div style={styles.bottomPanelContainer}>
          {this.renderbottomPanel()}
        </div>
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
