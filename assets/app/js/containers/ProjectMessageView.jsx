import { connect } from 'react-redux';
import { getProjectMessages, getProjectActiveUsers, getCurrentProject } from '../selector';
import Message from '../components/Message/Message.jsx';

const mapStateToProps = (state) => ({
  messages: getProjectMessages(state),
  users: getProjectActiveUsers(state),
  currentProject: getCurrentProject(state),
});
export default connect(mapStateToProps)(Message);
