import React, { Component } from 'react';

class MenuItem extends Component {
    render() {
        return (
            <div className="menu-item" onClick={this.props.switchProject}>{this.props.children}</div>
        );
    }
}

class LeftPanel extends Component {    
    render() {

        let menuItems = this.props.projects.map(project => 
            <MenuItem 
            key={project.id} 
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