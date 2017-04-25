import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';

import myTheme from '../../myTheme.js';
import { markDone } from '../../actions/ReduxTaskActions';
import DashboardItem from './DashboardItem.jsx';
import { getLocalUserId } from '../../utils/general.js';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  milestones: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
};

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
  },
  titleContainer: {
    flex: '0 1 auto',
  },
  itemListContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
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
    const currentUserId = getLocalUserId();
    // only show ongoing task assigned to me and unassigned
    const filterByAssignee = (task) => (!task.completed_on && (
      task.assignee_id === '' || task.assignee_id === null || task.assignee_id === currentUserId
    ));

    const compareStr = (s1, s2) => {
      if (!s1) {
        return -1;
      }
      if (!s2) {
        return 1;
      }
      const min = Math.min(s1.length, s2.length);
      for (let i = 0; i < min; i++) {
        if (s1.charCodeAt(i) !== s2.charCodeAt(i)) {
          return s1.charCodeAt(i) - s2.charCodeAt(i);
        }
      }
      return 0;
    };

    const sortByProjectMilestone = (taskA, taskB) => {
      if (taskA.project_id === taskB.project_id) {
        return compareStr(taskA.milestone_id, taskB.milestone_id);
      }
      return compareStr(taskA.project_id, taskB.project_id);
    };
    const tasksList = tasks.filter(filterByAssignee).sort(sortByProjectMilestone);
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
    const taskLength = taskRows.length;
    return (
      <div className="main-content" style={styles.container}>
        <div style={styles.titleContainer}>
          <h2 style={{ color: myTheme.palette.primary1Color }}>
            My Tasks
            {taskLength > 0 &&
              <Subheader style={{ display: 'inline-block', width: 'auto' }}>
                You have&nbsp;
                <span style={{ color: myTheme.palette.primary1Color }}>
                  {taskLength}
                </span> task{taskLength > 1 ? 's' : ''} to do
              </Subheader>
            }
          </h2>
        </div>
        {taskLength > 0 ?
          <Paper style={styles.itemListContainer}>
            <Table>
              <TableBody>
                {taskRows}
              </TableBody>
            </Table>
          </Paper> :
          <div className="no-items">
            <h3>Your task list is clean!</h3>
          </div>
        }
      </div>
    );
  }
}

Dashboard.propTypes = propTypes;

export default Dashboard;
