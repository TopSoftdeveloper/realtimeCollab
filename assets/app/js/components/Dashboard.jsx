import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Table, TableBody } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';

import { markDone } from '../actions/ReduxTaskActions';
import DashboardItem from './DashboardItem.jsx';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  milestones: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sortByDeadlineDescending: true,
    };
    this.toggleSortByDeadline = this.toggleSortByDeadline.bind(this);
    this.markTaskAsDone = this.markTaskAsDone.bind(this);
  }
  markTaskAsDone(taskId, projectId) {
    this.props.dispatch(markDone(taskId, projectId));
  }
  toggleSortByDeadline() {
    this.setState({
      sortByDeadlineDescending: !this.state.sortByDeadlineDescending,
    });
  }
  render() {
    const {
      milestones,
      tasks,
      projects,
    } = this.props;
    /* global localStorage */
    const currentUserId = localStorage.getItem('user_id');
    // only show ongoing task assigned to me and unassigned
    const filterByAssignee = (task) => (task.completed_on === null && (
      task.assignee_id === '' || task.assignee_id === null || task.assignee_id === currentUserId
    ));
    const tasksList = tasks.filter(filterByAssignee);
    const projectNameMap = {};
    projects.forEach(project => {
      projectNameMap[project.id] = project.content;
    });
    const milestoneNameMap = {};
    milestones.forEach(milestone => {
      milestoneNameMap[milestone.id] = milestone.content;
    });
    const taskRows = [];
    tasksList.forEach(task => {
      if (task.project_id) {
        const props = {
          task,
          key: task.id,
          projectName: projectNameMap[task.project_id],
          projectId: task.project_id,
          milestoneName: milestoneNameMap[task.milestone_id],
          onCheck: this.markTaskAsDone,
        };
        taskRows.push(<DashboardItem {...props} />);
      }
    });

    return (
      <Paper zDepth={1} className="main-content">
        <Subheader>You have {taskRows.length} task(s) to do</Subheader>
        <Table>
          <TableBody>
            {taskRows}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

Dashboard.propTypes = propTypes;


const mapStateToProps = (state) => ({
  milestones: state.milestones,
  projects: state.projects,
  tasks: state.tasks,
});
export default connect(mapStateToProps)(Dashboard);
