import React, { Component } from 'react';
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import {isLoggedIntoGoogle} from '../utils/auth'

class LeftPanel extends Component {

    switchProject(projectId) {
        let actions = this.props.actions
        let projectUrl = '/app/project/' + projectId;
        let project = this.props.projects.filter(project => project.id === projectId)[0]
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

        let listItems = this.props.projects.map(project =>
            <ListItem
                key={'projectlist' + project.id}
                primaryText={project.content}
                onTouchTap={this.switchProject.bind(this, project.id)}
            />
         );

        return (
            <List subheader="Projects" className="left-panel">
                {listItems}
            </List>
        );
    }
}

export default LeftPanel