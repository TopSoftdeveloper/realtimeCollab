import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { getCurrentTab } from '../utils/general';
import theme from '../myTheme.js';

const propTypes = {
  currentProject: PropTypes.object,
  actions: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  subheader: PropTypes.string.isRequired,
  onAddProject: PropTypes.func.isRequired,
};

class ProjectList extends Component {
  switchProject(projectId) {
    const currentProject = this.props.currentProject;
    if (!currentProject || currentProject.id !== projectId) {
      const projectUrl = `/app/project/${projectId}/${getCurrentTab()}`;
      const project = this.props.items.filter(proj => proj.id === projectId)[0];
      browserHistory.push(projectUrl);
      this.props.actions.switchToProject(project);
    }
  }

  render() {
    const { currentProject, items, onAddProject } = this.props;
    const listItems = items.map(project => {
      const active = currentProject && project.id === currentProject.id;
      return (
        <li
          key={project.id}
          onTouchTap={this.switchProject.bind(this, project.id)}
          style={{ color: active ? theme.palette.primary1Color : 'inherit' }}
        >
          {project.content}
        </li>
      );
    });

    let iconClassName = 'material-icons add_circle ';
    if (items.length === 0) {
      iconClassName += 'animated infinite wobble';
    }
    return (
      <div className="project-list">
        <div className="project-list-header">
          <table>
            <tbody>
              <tr>
                <td><Link to="/app/dashboard"><span>Projects</span></Link></td>
                <td><i className={iconClassName} onClick={onAddProject}>
                  add_circle
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
}

ProjectList.propTypes = propTypes;
export default ProjectList;
