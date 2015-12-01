import React, { Component } from 'react';
import { Link } from 'react-router'

class MenuItem extends Component {
    render() {
        let projectUrl = '/app/project/' + this.props.projectId;
        return (
            <div className="menu-item" onClick={this.props.switchProject}>
                <Link to={projectUrl}>{this.props.children}</Link>
            </div>
        );
    }
}

class LeftPanel extends Component {    
    render() {

        let menuItems = this.props.projects.map(project => 
            <MenuItem 
            key={project.id} 
            projectId={project.id}
            switchProject={this.props.switchProject.bind(this, project.id)}
            >{project.content}
            </MenuItem>
            );

        return (
            <div className="menu">
                <div className={(this.props.visibility ? "panel_visible " : "") + " left"}>
                    {menuItems}
                </div>
            </div>
        );
    }
}

export default LeftPanel