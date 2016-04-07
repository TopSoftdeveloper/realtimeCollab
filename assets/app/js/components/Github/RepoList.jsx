import React, { Component } from 'react'
import FlatButton from '../../../../../node_modules/material-ui/lib/flat-button'

class ListItem extends Component {
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

class List extends Component {
    render() {
        let repos = this.props.repos.map(repo => {
            return (
                <ListItem
                    key={repo.id}
                    name={repo.name}
                    owner={repo.owner.login}
                    primaryText={repo.full_name}
                    secondaryText={repo.description}
                    repoLink={repo.html_url}
                    syncWithGithub={this.props.syncWithGithub}
                    projectId={this.props.projectId}
                />
            )
        })

        if (repos.length === 0 && this.props.reposFetched) {
            return (
                <div className="github-repo-list">
                    <div className="no-items">
                        <h3>You don't have any GitHub repositories!</h3>
                    </div>
                </div>
            )
        }

        return (
            <div className="github-repo-list">
                <ul>
                    {repos}
                </ul>
            </div>
        )
    }
}

export default List