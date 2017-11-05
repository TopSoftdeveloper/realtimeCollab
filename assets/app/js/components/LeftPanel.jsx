import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { browserHistory } from 'react-router';
import assign from 'object-assign';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

import { getCurrentTab } from '../utils/general';
import { Color } from '../myTheme.js';
import ProjectModal from './ProjectModal.jsx';
import ProjectListItem from './ProjectListItem.jsx';

const styles = {
  subheader: {
    marginLeft: -8,
    color: Color.leftPanelItemHightColor,
    fontSize: 13,
  },
  listItem: {
    fontSize: 16,
    padding: '8px 0px 8px 18px',
    textOverflow: 'ellipsis',
    maxWidth: 'inherited',
  },
  middleVerticalAlign: {
    verticalAlign: 'middle',
  },
  leftPanelContainer: {
    paddingTop: 66,
    height: '100%',
  },
  badgeStyle: {
    marginRight: 10,
    float: 'right',
    verticalAlign: 'middle',
  },
  addProjectButton: {
  },
};
const propTypes = {
  currentProject: PropTypes.object,
  actions: PropTypes.object.isRequired,
  myTaskCount: PropTypes.number.isRequired,
  notificationCount: PropTypes.number.isRequired,
  projects: PropTypes.array.isRequired,
  onCreateProject: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
};
const contextTypes = {
  location: React.PropTypes.object,
};
class LeftPanel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isProjectModalOpen: false,
    };
    this.handleProjectModalClose = this.handleProjectModalClose.bind(this);
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.switchProject = this.switchProject.bind(this);
  }
  onDialogSubmit(projectName) {
    this.props.onCreateProject(projectName);
  }
  handleProjectModalClose() {
    this.setState({
      isProjectModalOpen: false,
    });
  }
  openModal() {
    this.setState({
      isProjectModalOpen: true,
    });
  }
  switchProject(projectId) {
    const { currentProject, actions, projects } = this.props;
    if (!currentProject || currentProject.id !== projectId) {
      const projectUrl = `/app/project/${projectId}/${getCurrentTab()}`;
      const project = projects.filter(proj => proj.id === projectId)[0];
      browserHistory.push(projectUrl);
      actions.switchToProject(project);
    }
  }
  renderProjectModal() {
    return (this.state.isProjectModalOpen &&
      <ProjectModal
        handleClose={this.handleProjectModalClose}
        onDialogSubmit={this.onDialogSubmit}
      />
    );
  }
  renderProjectList() {
    const { currentProject, projects } = this.props;
    return projects.map(project => {
      const active = currentProject && project.id === currentProject.id;
      return (
        <ProjectListItem
          key={project.id}
          projectId={project.id}
          projectContent={project.content}
          active={active}
          onSwitchProject={this.switchProject}
          itemStyle={styles.listItem}
        />
      );
    });
  }
  renderNotificationLink() {
    const path = '/app/notifications';
    const active = this.context.location.pathname === path;
    const text = this.props.notificationCount ? (
      <span>
        Notification
        <span
          className="left-panel-badge"
          style={assign({}, styles.badgeStyle, active && {
            color: 'white',
          })}
        >
          {this.props.notificationCount}
        </span>
      </span>
    ) : 'Notification';
    return (
      <ListItem
        className="left-panel-item"
        primaryText={text}
        onTouchTap={() => { browserHistory.push(path); }}
        innerDivStyle={assign({}, styles.listItem, active && {
          backgroundColor: Color.leftPanelItemHightColor,
          color: 'white',
        })}
        hoverColor={Color.leftPanelItemHightColor}
      />
    );
  }
  renderMyTasksLink() {
    const path = '/app/dashboard';
    const active = this.context.location.pathname === path;
    const text = this.props.myTaskCount ? (
      <span>
        My Task
        <span
          style={assign({}, styles.badgeStyle, active && {
            color: 'white',
          })}
        >
          {this.props.myTaskCount}
        </span>
      </span>
    ) : 'My Task';
    return (
      <ListItem
        className="left-panel-item"
        primaryText={text}
        onTouchTap={() => { browserHistory.push(path); }}
        innerDivStyle={assign({}, styles.listItem, active && {
          backgroundColor: Color.leftPanelItemHightColor,
          color: 'white',
        })}
        hoverColor={Color.leftPanelItemHightColor}
      />
    );
  }
  renderAddProjectIcon() {
    let iconClassName = 'add-project-icon material-icons';
    if (this.props.projects.length === 0) {
      iconClassName += ' animated infinite wobble';
    }
    return (
      <IconButton
        style={styles.middleVerticalAlign}
        iconStyle={assign(styles.addProjectButton, {
          color: this.props.muiTheme.palette.primary1Color,
        })}
        onTouchTap={this.openModal}
        iconClassName={iconClassName}
      >
        add_circle
      </IconButton>
    );
  }
  render() {
    return (
      <Paper zDepth={1} style={styles.leftPanelContainer}>
        <List>
          <Subheader style={styles.subheader}>SHORTCUT</Subheader>
          {this.renderMyTasksLink()}
          {this.renderNotificationLink()}
        </List>
        <Divider />
        <List>
          <Subheader style={styles.subheader} >
            <span style={styles.middleVerticalAlign}>PROJECTS&nbsp;</span>
            {this.renderAddProjectIcon()}
          </Subheader>
          {this.renderProjectList()}
        </List>

        {this.renderProjectModal()}
      </Paper>
    );
  }
}
LeftPanel.contextTypes = contextTypes;
LeftPanel.propTypes = propTypes;
export default muiThemeable()(LeftPanel);
