import React, { Component, PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import assign from 'object-assign';

import { Color } from '../../myTheme.js';
import { toFuzzyTime } from '../../utils/general';

const propTypes = {
  notification: PropTypes.object.isRequired,
  user: PropTypes.object,
  actions: React.PropTypes.shape({
    onMarkNotificationAsRead: PropTypes.func.isRequired,
    onAcceptProject: PropTypes.func.isRequired,
    onDeclineProject: PropTypes.func.isRequired,
  }),
};
const styles = {
  actionContainer: {
    backgroundColor: 'rgb(238, 238, 238)',
  },
  container: {
    marginBottom: 10,
  },
};
class NotificationItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.acceptProject = this.acceptProject.bind(this);
    this.declineProject = this.declineProject.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
  }
  markAsRead() {
    if (!this.props.notification.read) {
      this.props.actions.onMarkNotificationAsRead(this.props.notification.id);
    }
  }
  acceptProject() {
    const { notification } = this.props;
    this.props.actions.onAcceptProject(notification.meta.project_id, notification.id);
  }
  declineProject() {
    const { notification } = this.props;
    this.props.actions.onDeclineProject(notification.meta.project_id, notification.id);
  }
  renderActionButtions() {
    return (this.props.notification.type === 'INVITE_TO_PROJECT' &&

    <CardActions style={styles.actionContainer}>
      <FlatButton
        style={styles.button}
        label="Decline"
        secondary
        onTouchTap={this.declineProject}
      />
      <FlatButton
        style={styles.button}
        label="Accept"
        primary
        onTouchTap={this.acceptProject}
      />
    </CardActions>
    );
  }
  render() {
    const { notification, user } = this.props;
    return (
      <Card
        style={assign({}, styles.container, !notification.read && {
          backgroundColor: Color.messageViewPinBackgroundColor,
        })}
      >
        <CardHeader
          onClick={this.markAsRead}
          actAsExpander
          title={notification.text}
          subtitle={toFuzzyTime(notification.time)}
          avatar={user && <Avatar src={user.display_image} />}
        />
        {this.renderActionButtions()}
      </Card>
    );
  }

  // let notifClassName = 'notif-item';
  // notifClassName += read ? ' notif-read' : ' notif-unread';
}

NotificationItem.propTypes = propTypes;
export default NotificationItem;
