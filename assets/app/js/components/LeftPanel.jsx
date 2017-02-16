import React, { Component, PropTypes } from 'react';
import ProjectList from './ProjectList.jsx';
import ProjectModal from './ProjectModal.jsx';

const propTypes = {
  currentProject: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  apps: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  onCreateProject: PropTypes.func.isRequired,
};

class LeftPanel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
    };
    this.handleProjectModalClose = this.handleProjectModalClose.bind(this);
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  onDialogSubmit(projectName) {
    this.props.onCreateProject(projectName);
  }
  handleProjectModalClose() {
    this.setState({
      isDialogOpen: false,
    });
  }
  openModal() {
    this.setState({
      isDialogOpen: true,
    });
  }
  renderProjectModal() {
    return (this.state.isDialogOpen &&
      <ProjectModal
        handleClose={this.handleProjectModalClose}
        onDialogSubmit={this.onDialogSubmit}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="collab-logo">
          <h3>Collab</h3>
        </div>
        <ProjectList
          currentProject={this.props.currentProject}
          subheader="Projects"
          items={this.props.projects}
          actions={this.props.actions}
          onAddProject={this.openModal}
        />
        {this.renderProjectModal()}
      </div>
    );
  }
}
LeftPanel.propTypes = propTypes;
export default LeftPanel;
