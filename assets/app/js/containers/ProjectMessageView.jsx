import { connect } from 'react-redux';
import { getProjectMessages, getProjectActiveUsers, getCurrentProject } from '../selector';
import Message from '../components/Message/Message.jsx';
import { createMessage } from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => ({
  messages: getProjectMessages(state),
  users: getProjectActiveUsers(state),
  currentProject: getCurrentProject(state),
});
const mapDispatchToProps = (dispatch) => ({
  onPostNewMessage: (message) => {
    createMessage(message)(dispatch);
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Message);
