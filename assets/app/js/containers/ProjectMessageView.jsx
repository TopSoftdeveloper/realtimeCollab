import { connect } from 'react-redux';
import { getProjectMessages, getProjectActiveUsers, getCurrentProject } from '../selector';
import Message from '../components/Message/Message.jsx';
import { createUserMessage, pinMessage, unpinMessage, editMessageContent, deleteMessage }
  from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => ({
  messages: getProjectMessages(state),
  users: getProjectActiveUsers(state),
  currentProject: getCurrentProject(state),
});
const mapDispatchToProps = (dispatch) => ({
  actions: {
    onPostNewMessage: (content, projectId, milestoneId) => {
      createUserMessage(content, projectId, milestoneId)(dispatch);
    },
    onPinMessage: (messageId) => {
      pinMessage(messageId)(dispatch);
    },
    onUnpinMessage: (messageId) => {
      unpinMessage(messageId)(dispatch);
    },
    onEditMessageContent: (messageId, content) => {
      editMessageContent(messageId, content)(dispatch);
    },
    onDeleteMessage: (messageId) => {
      deleteMessage(messageId)(dispatch);
    },
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Message);
