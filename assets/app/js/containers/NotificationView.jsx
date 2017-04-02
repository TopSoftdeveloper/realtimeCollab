import { connect } from 'react-redux';

import Notification from '../components/Notification/Notification.jsx';
import { markNotificationAsRead, acceptProject, declineProject }
from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  users: state.users,
});
const mapDispatchToProps = (dispatch) => ({
  actions: {
    onMarkNotificationAsRead: (notificationId) => {
      markNotificationAsRead(notificationId)(dispatch);
    },
    onAcceptProject: (projectId, notificationId) => {
      acceptProject(projectId, notificationId)(dispatch);
    },
    onDeclineProject: (projectId, notificationId) => {
      declineProject(projectId, notificationId)(dispatch);
    },
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
