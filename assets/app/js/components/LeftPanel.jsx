import React, { Component } from 'react';
import { Link } from 'react-router'
import List from 'material-ui/lib/lists/list'
import ListDivider from 'material-ui/lib/lists/list-divider'
import ListItem from 'material-ui/lib/lists/list-item'

class LeftPanel extends Component {
    switchProject(projectId) {
        let projectUrl = '/app/project/' + projectId;
        this.props.history.pushState(null, projectUrl)
    }

    render() {

        let listItems = this.props.projects.map(project =>
            <ListItem
                key={project.id}
                primaryText={project.content}
                onClick={this.switchProject.bind(this, project.id)}
            />
         );

        return (
            <List subheader="Projects">
                {listItems}
            </List>
        );
    }
}

export default LeftPanel