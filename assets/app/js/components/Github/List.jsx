import React, { Component } from 'react'
import FlatButton from 'material-ui/lib/flat-button'

class ListItem extends Component {
    render() {
        return (
            <li>
                <FlatButton className="select-repo-btn" label="Select" secondary={true}/>
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
                    primaryText={repo.full_name}
                    secondaryText={repo.description}
                    repoLink={repo.html_url}
                />
            )
        })

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