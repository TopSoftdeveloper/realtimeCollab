import React, { Component } from 'react'
import GithubListItem from './GithubListItem.jsx';

class List extends Component {
    render() {
        let repos = this.props.repos.map(repo => {
            return (
                <GithubListItem
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
