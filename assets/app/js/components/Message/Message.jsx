import React, { Component, PropTypes } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { FormControl } from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import assign from 'object-assign';

import MessageModal from './MessageModal.jsx';
import MessageList from './MessageList.jsx';
import ClippedText from '../Common/ClippedText.jsx';

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
    fontSize: 15,
    backgroundColor: 'rgb(232, 232, 232)',
    color: 'black',
    height: 50,
    maxHeight: 50,
    fontWeight: 550,
  },
  messageListContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  bottomPanelContainer: {
    flex: '0 1 40px',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderTop: '1px solid lightgray',
  },
  closeIconContainer: {
    fontSize: 20,
    paddingRight: 5,
    paddingTop: 5,
    float: 'right',
  },
  contentContainer: {
    marginTop: 20,
  },
  emptyContainer: {
    color: '#aaaaaa',
    left: '50%',
    textAlign: 'center',
  },
};
const modes = {
  editMode: {
    type: 'editMode',
    messageContent: null,
    onSumbitCallback: null,
  },
  postMode: {
    type: 'postMode',
  },
  initialMode: {
    type: 'initialMode',
  },
};
class Message extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSystemActivity: true,
      showUserMessage: true,
      mode: modes.initialMode,
    };
    this.onClickDismissButton = this.onClickDismissButton.bind(this);
    this.toggleSystemActivity = this.toggleSystemActivity.bind(this);
    this.toggleUserMessage = this.toggleUserMessage.bind(this);
    this.postNewMessage = this.postNewMessage.bind(this);
    this.onEnterPostMode = this.onEnterPostMode.bind(this);
    this.onLeavePostMode = this.onLeavePostMode.bind(this);
    this.onEnterEditMode = this.onEnterEditMode.bind(this);
    this.onLeaveEditMode = this.onLeaveEditMode.bind(this);
  }
  onClickDismissButton() {
    this.props.onDismiss();
  }
  onEnterPostMode() {
    this.setState({
      mode: modes.postMode,
    });
  }
  onLeavePostMode() {
    this.setState({
      mode: modes.initialMode,
    });
  }
  onEnterEditMode(messageContent, onSumbitCallback) {
    this.setState({
      mode: assign(modes.editMode, { messageContent, onSumbitCallback }),
    });
  }
  onLeaveEditMode() {
    this.setState({
      mode: modes.initialMode,
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
      color: 'grey',
    };
    return (
      <span>
        <FlatButton
          labelStyle={messageLabelStyle}
          label={userMessagesText}
          primary
          onTouchTap={this.toggleUserMessage}
        />
        <FlatButton
          labelStyle={activityLabelStyle}
          label={systemActivityText}

          onTouchTap={this.toggleSystemActivity}
        />
      </span>
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
            onEnterEditMode={this.onEnterEditMode}
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
        <MessageList
          pinned
          onEnterEditMode={this.onEnterEditMode}
          actions={this.props.actions}
          messages={pinnedMessages}
          users={this.props.users}
        />
      </div>

    );
  }
  renderbottomPanel() {
    if (this.state.mode.type === modes.postMode.type) {
      return (
        <MessageModal
          onSubmitMethod={this.postNewMessage}
          onCloseMethod={this.onLeavePostMode}
        />
      );
    } else if (this.state.mode.type === modes.editMode.type && this.state.mode.messageContent) {
      return (
        <MessageModal
          onSubmitMethod={this.state.mode.onSumbitCallback}
          onCloseMethod={this.onLeaveEditMode}
          contentValue={this.state.mode.messageContent}
        />
      );
    }
    return (
      <FormControl
        type="text"
        onFocus={this.onEnterPostMode}
        placeholder="Leave your messages here!"
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
          <ClippedText text={this.props.title} placement="bottom" limit={40} />
          {this.renderInfoButtons(milestoneMessages)}
          <IconButton
            style={styles.closeIconContainer}
            onTouchTap={this.onClickDismissButton}
          >
            <i className="material-icons">clear</i>
          </IconButton>
        </Subheader>
        <div style={styles.messageListContainer}>
          {this.renderPinnedMessageList(milestoneMessages)}
          {this.renderMessageList(milestoneMessages)}
        </div>

        <Paper zDepth={3} style={styles.bottomPanelContainer}>
          {this.renderbottomPanel()}
        </Paper>
      </div>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
