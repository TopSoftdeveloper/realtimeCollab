import { connect } from 'react-redux';

import Notification from '../components/Notification/Notification.jsx';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  users: state.users,
});

export default connect(mapStateToProps)(Notification);
