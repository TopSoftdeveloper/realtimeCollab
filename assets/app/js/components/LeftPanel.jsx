import React, { Component } from 'react';

class MenuItem extends Component {
    navigate(hash) {
        window.location.hash = hash;
    }

    render() {
        return (
            <div className="menu-item" onClick={this.navigate.bind(this, this.props.hash)}>{this.props.children}</div>
        );
    }
}

class LeftPanel extends Component {    
    render() {
        let menuItems = this.props.projects.map(project => 
            <MenuItem key={project.id} hash={project.id}>{project.content}</MenuItem>);

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