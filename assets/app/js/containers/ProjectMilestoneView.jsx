import { connect } from 'react-redux';
import MilestoneView from '../components/Milestone/MilestoneView.jsx';
import { getProjectMilestones, getProjectTasks } from '../selector';

const mapStateToProps = (state) => ({
  milestones: getProjectMilestones(state),
  tasks: getProjectTasks(state),
});

export default connect(mapStateToProps)(MilestoneView);
