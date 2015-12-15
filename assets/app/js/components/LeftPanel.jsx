import React, { Component } from 'react';
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'

class LeftPanel extends Component {
    switchProject(projectId) {
        let projectUrl = '/app/project/' + projectId;
        this.props.history.pushState(null, projectUrl)
        this.props.onSwitchProject(projectId)
    }

    render() {

        let listItems = this.props.projects.map(project =>
            <ListItem
                key={project.id}
                primaryText={project.content}
                onTouchTap={this.switchProject.bind(this, project.id)}
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