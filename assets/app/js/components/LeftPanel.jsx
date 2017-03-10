import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { browserHistory } from 'react-router';
import assign from 'object-assign';
import { getCurrentTab } from '../utils/general';
import { Color } from '../myTheme.js';
import ProjectModal from './ProjectModal.jsx';
import ProjectListItem from './ProjectListItem.jsx';

const styles = {
  subheader: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: -4,
  },
  listItem: {
    fontSize: 16,
    padding: '8px 0px 8px 18px',
    color: 'white',
    textOverflow: 'ellipsis',
    maxWidth: 'inherited',
  },
  middleVerticalAlign: {
    verticalAlign: 'middle',
  },
  leftPanelContainer: {
    marginTop: 50,
  },
};
const propTypes = {
  currentProject: PropTypes.object,
  actions: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  onCreateProject: PropTypes.func.isRequired,
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
  renderMyTasksLink() {
    const path = '/app/dashboard';
    const active = this.context.location.pathname === path;
    return (
      <ListItem
        primaryText="My Tasks"
        onTouchTap={() => { browserHistory.push('/app/dashboard'); }}
        innerDivStyle={assign({}, styles.listItem, active && {
          backgroundColor: Color.leftPanelItemHightColor,
        })}
        hoverColor={Color.leftPanelItemHightColor}
      />
    );
  }
  renderAddProjectIcon() {
    let iconClassName = 'material-icons add_circle ';
    if (this.props.projects.length === 0) {
      iconClassName += 'animated infinite wobble';
    }
    return (
      <i
        style={styles.middleVerticalAlign}
        className={iconClassName}
        onClick={this.openModal}
      >
        add_circle
      </i>
    );
  }
  render() {
    return (
      <div style={styles.leftPanelContainer}>
        <List>
          <Subheader style={styles.subheader}>SHORTCUT</Subheader>
          {this.renderMyTasksLink()}
        </List>
        <List>
          <Subheader style={styles.subheader} >
            <span style={styles.middleVerticalAlign}>PROJECTS&nbsp;</span>
            {this.renderAddProjectIcon()}
          </Subheader>
          {this.renderProjectList()}
        </List>

        {this.renderProjectModal()}
      </div>
    );
  }
}
LeftPanel.contextTypes = contextTypes;
LeftPanel.propTypes = propTypes;
export default LeftPanel;
