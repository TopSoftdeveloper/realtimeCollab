import { connect } from 'react-redux';
import { getProjectMilestones, getProjectActiveUsers, getCurrentProject } from '../selector';
import TaskModal from '../components/Milestone/TaskModal.jsx';

const mapStateToProps = (state) => ({
  milestones: getProjectMilestones(state),
  users: getProjectActiveUsers(state),
  currentProject: getCurrentProject(state),
});
export default connect(mapStateToProps)(TaskModal);
