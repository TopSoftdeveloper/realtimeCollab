import React, { Component } from 'react';
import List from './list/List.jsx'

class LeftPanel extends Component {

    render() {
        return (
            <List
                subheader="Projects"
                items={this.props.projects}
                history={this.props.history}
                app={this.props.app}
                actions={this.props.actions}
            />
        );
    }
}

export default LeftPanel