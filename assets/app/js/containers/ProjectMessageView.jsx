import { connect } from 'react-redux';
import { getProjectMessages, getProjectActiveUsers, getCurrentProject } from '../selector';
import Message from '../components/Message/Message.jsx';
import { createMessage, pinMessage, unpinMessage, editMessageContent, deleteMessage }
  from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => ({
  messages: getProjectMessages(state),
  users: getProjectActiveUsers(state),
  currentProject: getCurrentProject(state),
});
const mapDispatchToProps = (dispatch) => ({
  actions: {
    onPostNewMessage: (message) => {
      createMessage(message)(dispatch);
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
