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
        return (
            <div className="menu">
                <div className={(this.props.visibility ? "panel_visible " : "") + " left"}>
                    <MenuItem hash="first-page">First Page</MenuItem>
                    <MenuItem hash="second-page">Second Page</MenuItem>
                    <MenuItem hash="third-page">Third Page</MenuItem>
                </div>
            </div>
        );
    }
}

export default LeftPanel