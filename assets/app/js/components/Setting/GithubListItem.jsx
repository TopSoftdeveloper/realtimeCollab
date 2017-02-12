import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';

class GithubListItem extends Component {
    render() {
        return (
            <li>
                <FlatButton
                    className="select-repo-btn"
                    label="Select"
                    secondary={true}
                    onTouchTap={this.props.syncWithGithub.bind(this,
                    this.props.projectId,
                    this.props.name,
                    this.props.owner)}
                />
                <h4><a href={this.props.repoLink} target="_blank">{this.props.primaryText}</a></h4>
                <p>{this.props.secondaryText}</p>
            </li>
        )
    }
}

export default GithubListItem;
