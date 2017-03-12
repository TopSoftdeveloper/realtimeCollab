import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import assign from 'object-assign';
import ReactMarkdown from 'react-markdown';

import UserAvatar from '../Common/UserAvatar.jsx';
import { toFuzzyTime } from '../../utils/general';
import { Color } from '../../myTheme.js';

const propTypes = {
  pinned: PropTypes.bool,
  message: PropTypes.object.isRequired,
  onPinMessage: PropTypes.func.isRequired,
  onUnpinMessage: PropTypes.func.isRequired,
  onEditMessageContent: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onEnterEditMode: PropTypes.func.isRequired,
};
const styles = {
  content: {
  },
  avatarContainer: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 2,
    display: 'inline-block',
  },
  header: {
    fontsize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    marginLeft: 5,
    fontSize: 11,
    color: '#999',
  },
  container: {
    display: 'block',
    padding: 5,
    marginLeft: 1,
    marginRight: 0,
    borderTop: '1px solid rgba(0,0,0,0.12)',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
  },
  icon: {
    fontSize: 20,
  },
  iconButton: {
    width: 12,
    height: 12,
  },
  iconMenu: {
    marginRight: 10,
    marginTop: -8,
    float: 'right',
  },
};
class UserMessage extends Component {
  constructor(props, context) {
    super(props, context);
    this.pinMessage = this.pinMessage.bind(this);
    this.unpinMessage = this.unpinMessage.bind(this);
    this.editMessageContent = this.editMessageContent.bind(this);
    this.enterEditMode = this.enterEditMode.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }
  pinMessage() {
    this.props.onPinMessage(this.props.message.id);
  }
  unpinMessage() {
    this.props.onUnpinMessage(this.props.message.id);
  }
  editMessageContent(content) {
    this.props.onEditMessageContent(this.props.message.id, content);
  }
  enterEditMode() {
    this.props.onEnterEditMode(this.props.message.content, this.editMessageContent);
  }
  deleteMessage() {
    this.props.onDeleteMessage(this.props.message.id);
  }
  renderOptionMenu() {
    return (
      <IconMenu
        style={styles.iconMenu}
        iconButtonElement={
          <IconButton
            style={styles.iconButton}
            iconStyle={styles.icon}
            iconClassName="material-icons"
            tooltipPosition="bottom-left"
          >
            keyboard_arrow_down
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {this.props.message.pinned
          ? <MenuItem onTouchTap={this.unpinMessage} primaryText="Unpin from Top" />
          : <MenuItem onTouchTap={this.pinMessage} primaryText="Pin to Top" />}
        <MenuItem onTouchTap={this.enterEditMode} primaryText="Edit" />
        <MenuItem onTouchTap={this.deleteMessage} primaryText="Delete" />
      </IconMenu>
    );
  }
  renderMainContent() {
    const { message } = this.props;
    return (
      <div style={styles.content}>
        <ReactMarkdown
          source={message.content}
          escapeHtml
        />
      </div>
    );
  }
  render() {
    const { message, pinned } = this.props;
    return (
      <Row
        style={assign({}, styles.container, message.pinned && {
          borderLeft: '2px solid rgb(254, 209, 45)',
        }, pinned && {
          backgroundColor: Color.messageViewPinBackgroundColor,
        })}
      >
        <Col xs={1}>
          <span style={styles.avatarContainer}>
            <UserAvatar
              imgSrc={message.authorAvatarUrl}
              displayName={message.authorName}
            />
          </span>
        </Col>
        <Col xs={11}>
          <div>
            <span style={styles.header}>{message.authorName}</span>
            <span style={styles.subHeader}>
              {toFuzzyTime(message.createdAt)}
              {message.createdAt !== message.updatedAt &&
                ' • Edited'
              }
            </span>
            {this.renderOptionMenu()}
          </div>

          {this.renderMainContent()}
        </Col>
      </Row>
    );
  }
}

UserMessage.propTypes = propTypes;
export default UserMessage;
