import React, { Component } from 'react';
import {isLoggedIntoGoogle} from '../../utils/auth'

class List extends Component {
    switchProject(projectId) {
        let actions = this.props.actions
        let projectUrl = '/app/project/' + projectId;
        let project = this.props.items.filter(project => project.id === projectId)[0]
        this.props.history.pushState(null, projectUrl)
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
                if (this.props.currentProject.id === project.id) {
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

        return (
            <div className="project-list">
                <div className="project-list-header">
                    <table>
                        <tbody>
                        <tr>
                            <td><span>Projects</span></td>
                            <td><i className="material-icons add_circle">add_circle</i></td>
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