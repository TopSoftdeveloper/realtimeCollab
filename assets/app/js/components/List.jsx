import React, { Component } from 'react';
import {isLoggedIntoGoogle} from '../utils/auth'
import { browserHistory } from 'react-router'

class List extends Component {
    switchProject(projectId) {
        let actions = this.props.actions
        let projectUrl = '/app/project/' + projectId;
        let project = this.props.items.filter(project => project.id === projectId)[0]
        browserHistory.push(projectUrl)
        actions.switchToProject(projectId)
        if (!this.props.app.logged_into_google) {
            isLoggedIntoGoogle(function(authResult) {
                if (authResult && !authResult.error) {
                    actions.loggedIntoGoogle()
                    actions.initializeFiles(project)
                } else {
                    actions.loggedOutGoogle()
                }
            })
        } else {
            actions.initializeFiles(project)
        }
    }

    render() {
        let listItems = this.props.items.map(project => {
                if (this.props.currentProject && this.props.currentProject.id === project.id) {
                    return (
                        <li
                            onTouchTap={this.switchProject.bind(this, project.id)}
                            key={'projectlist' + project.id}>
                            <b>{project.content}</b>
                        </li>
                    )
                }
                return (
                    <li
                        onTouchTap={this.switchProject.bind(this, project.id)}
                        key={'projectlist' + project.id}>
                        {project.content}
                    </li>
                )
            }
        )

        let iconClassName = "material-icons add_circle "
        if (this.props.items.length === 0) {
            iconClassName += "animated infinite wobble"
        }

        return (
            <div className="project-list">
                <div className="project-list-header">
                    <table>
                        <tbody>
                        <tr>
                            <td><span>Projects</span></td>
                            <td><i
                                className={iconClassName}
                                onClick={this.props.onAddProject}>add_circle</i>
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