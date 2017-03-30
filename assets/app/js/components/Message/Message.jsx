import React, { Component, PropTypes } from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { Row, Col, FormControl } from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import assign from 'object-assign';

import MessageModal from './MessageModal.jsx';
import MessageList from './MessageList.jsx';
import ClippedText from './../Common/ClippedText.jsx';

const propTypes = {
  // props passed by container
  milestones: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  currentProject: PropTypes.object.isRequired,
  actions: React.PropTypes.shape({
    onPostNewMessage: PropTypes.func.isRequired,
    onPinMessage: PropTypes.func.isRequired,
    onUnpinMessage: PropTypes.func.isRequired,
    onEditMessageContent: PropTypes.func.isRequired,
    onDeleteMessage: PropTypes.func.isRequired,
  }),
  // props passed by parents
  showMilestoneSelector: PropTypes.bool,
  milestoneId: PropTypes.string,
  onDismiss: PropTypes.func,
  title: PropTypes.string,
};


const styles = {
  container: {
    marginTop: 10,
    marginBottom: 0,
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  titleContainer: {
    flex: '0 1 auto',
    fontSize: 15,
    color: 'black',
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
    marginTop: 0,
  },
  emptyContainer: {
    color: '#aaaaaa',
    left: '50%',
    textAlign: 'center',
  },
  selectField: {
    verticalAlign: 'middle',
    maxWidth: 200,
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

const FILTERS = {
  project: { // predefined key shows only project level message with null milestone_id
    key: 'project',
    label: 'Project',
  },
  all: { // predefined key shows only all message
    key: 'all',
    label: 'All',
  },
};
const translateMilestoneIdToFilterId = (milestoneId) => (
  milestoneId || FILTERS.project.key
);
const translateFilterIdToMilestoneId = (filterId) => {
  if (filterId === FILTERS.project.key || filterId === FILTERS.all.key) {
    return null;
  }
  return filterId;
};
class Message extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSystemActivity: true,
      showUserMessage: true,
      mode: modes.initialMode,
      filterId: translateMilestoneIdToFilterId(props.milestoneId),
    };
    this.onClickDismissButton = this.onClickDismissButton.bind(this);
    this.toggleSystemActivity = this.toggleSystemActivity.bind(this);
    this.toggleUserMessage = this.toggleUserMessage.bind(this);
    this.postNewMessage = this.postNewMessage.bind(this);
    this.onEnterPostMode = this.onEnterPostMode.bind(this);
    this.onLeavePostMode = this.onLeavePostMode.bind(this);
    this.onEnterEditMode = this.onEnterEditMode.bind(this);
    this.onLeaveEditMode = this.onLeaveEditMode.bind(this);
    this.handldeSelectedMilestoneIdChange = this.handldeSelectedMilestoneIdChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    // switch among milestones in same project or switch among different projects
    if (nextProps.currentProject.id !== this.props.currentProject.id ||
    nextProps.milestoneId !== this.props.milestoneId) {
      this.setState({
        filterId: translateMilestoneIdToFilterId(nextProps.milestoneId),
      });
    }
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
  handldeSelectedMilestoneIdChange(event, index, value) {
    this.setState({
      filterId: value,
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
    /* global localStorage */
    this.props.actions.onPostNewMessage(content,
      this.props.currentProject.id, translateFilterIdToMilestoneId(this.state.filterId));
  }
  renderMilestoneSelector() {
    if (!this.props.showMilestoneSelector) {
      return (
        <ClippedText
          text={this.props.title}
          limit={30}
          showToolTip={false}
        />
      );
    }
    const milestoneMenuItems = this.props.milestones.map(milestone => (
      <MenuItem
        value={milestone.id}
        key={milestone.id}
        primaryText={milestone.content}
      />
    ));
    let viewMenuItems = [
      <MenuItem
        value={FILTERS.all.key}
        key={FILTERS.all.key}
        primaryText={FILTERS.all.label}
      />,
      <MenuItem
        value={FILTERS.project.key}
        key={'project-level'}
        primaryText={FILTERS.project.label}
      />,
    ];
    if (milestoneMenuItems.length > 0) {
      viewMenuItems = [
        ...viewMenuItems,
        <Divider key="message_vierw_menu_item_divider" />,
        <Subheader key="message_vierw_menu_item_subheader">Milestones</Subheader>,
        ...milestoneMenuItems,
      ];
    }
    return (
      <SelectField
        disabled={!this.props.showMilestoneSelector}
        value={this.state.filterId}
        onChange={this.handldeSelectedMilestoneIdChange}
        style={styles.selectField}
      >
        {viewMenuItems}
      </SelectField>

    );
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
    const { messages, onDismiss } = this.props;
    const milestoneMessages = messages.filter(message => {
      if (this.state.filterId === FILTERS.all.key) {
        return true;
      } else if (this.state.filterId === FILTERS.project.key) {
        return message.milestone_id === null;
      }
      return message.milestone_id === this.state.filterId;
    });
    return (
      <Paper zDepth={1} rounded={false} style={styles.container}>
        <Subheader key={`${this.state.filterId}header`} style={styles.titleContainer}>
          <Row>
            <Col xs={11}>
              {
                this.renderMilestoneSelector()
              }
              {this.renderInfoButtons(milestoneMessages)}

            </Col>
            <Col xs={1}>
              {onDismiss &&
                <IconButton
                  style={styles.closeIconContainer}
                  onTouchTap={this.onClickDismissButton}
                >
                  <i className="material-icons">clear</i>
                </IconButton>
              }
            </Col>
          </Row>
        </Subheader>
        <Divider key="message_vierw_header_divider" />
        <div style={styles.messageListContainer}>
          {this.renderPinnedMessageList(milestoneMessages)}
          {this.renderMessageList(milestoneMessages)}
        </div>

        <Paper zDepth={3} style={styles.bottomPanelContainer}>
          {this.renderbottomPanel()}
        </Paper>
      </Paper>
    );
  }
}

Message.propTypes = propTypes;
export default Message;
