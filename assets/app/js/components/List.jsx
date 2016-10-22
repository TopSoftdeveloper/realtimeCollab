import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router'
import {getCurrentTab} from '../utils/general'
import theme from '../myTheme.js'

class List extends Component {
    switchProject(projectId) {
      const {currentProject, actions} = this.props
      if(!currentProject || currentProject.id !== projectId) {
        let actions = this.props.actions
        let projectUrl = '/app/project/' + projectId + '/' + getCurrentTab();
        let project = this.props.items.filter(project => project.id === projectId)[0]
        browserHistory.push(projectUrl)
        actions.switchToProject(project)
      }
    }

    render() {
      const {currentProject, items, app, actions, onAddProject} = this.props
        let listItems = items.map(project => {
                const active = currentProject && project.id === currentProject.id

                return (
                    <li
                      key={'projectlist' + project.id}
                      onTouchTap={this.switchProject.bind(this, project.id)}
                      style={{color: active?theme.palette.primary1Color:'inherit'}}
                    >
                      {project.content}
                    </li>
                )
            }
        )

        let iconClassName = "material-icons add_circle "
        if (items.length === 0) {
            iconClassName += "animated infinite wobble"
        }
        return (
            <div className="project-list">
                <div className="project-list-header">
                    <table>
                        <tbody>
                        <tr>
                            <td><Link to="/app/dashboard">Projects</Link></td>
                            <td><i
                                className={iconClassName}
                                onClick={onAddProject}>add_circle</i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <ul>
                    {listItems}
                </ul>
            </div>
        )
    }
}

export default List
