import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';
import {toFuzzyTime} from '../utils/general'
import { browserHistory } from 'react-router'

class SearchResults extends Component {
    constructor() {
        super(...arguments);
        this.state = {
        }

    }

    goToResult(link, e) {
        e.preventDefault()
        window.open(link, '_newtab')
    }

    goToTask(result, e) {
        e.preventDefault()
        browserHistory.push('/app/project/' + result.project_id + '/milestones?highlight=' + result.id)
    }

    render() {
        let driveResults = this.props.search.filter(result => result.type === 'drive')
        let taskResults = this.props.search.filter(result => result.type === 'task')
        let driveListItems = driveResults.map(result => {
            return (
                <div key={result.id}>
                    <ListItem
                        leftAvatar={<Avatar src={result.thumbnail} />}
                        onTouchTap={this.goToResult.bind(this, result.link)}
                        primaryText={result.primaryText}
                        secondaryText={
                            <p>
                              <span style={{color: Colors.darkBlack}}>Last modified by {result.secondaryText}</span>
                              &nbsp;&nbsp;&nbsp;{toFuzzyTime(result.modifiedTime)}
                            </p>
                         }
                        secondaryTextLines={1}
                    />
                    <Divider inset={true} />
                </div>
            )
        })
        let taskListItems = taskResults.map(result => {
            return (
                <div key={result.id}>
                    <ListItem
                        leftAvatar={<Avatar src={result.thumbnail} />}
                        onTouchTap={this.goToTask.bind(this, result)}
                        primaryText={result.primaryText}
                        secondaryText={
                            <p>
                              <span style={{color: Colors.darkBlack}}>Assigned to {result.secondaryText}</span>
                              &nbsp;&nbsp;&nbsp;{result.project_content}
                            </p>
                         }
                        secondaryTextLines={1}
                    />
                    <Divider inset={true} />
                </div>
            )
        })

        if (driveResults.length === 0 && taskResults.length === 0) {
            return (
                <div className="main-content">
                    <div className="no-items">
                        <h4>No search results for <b>{this.props.app.queryString}</b></h4>
                    </div>
                </div>
            )
        }

        let taskList = null
        let driveList = null
        if (taskResults.length > 0) {
            taskList = (
                <List subheader="Assigned Tasks">
                    {taskListItems}
                </List>
            )
        }

        if (driveResults.length > 0) {
            driveList = (
                <List subheader="Files">
                    {driveListItems}
                </List>
            )
        }

        return (
            <div className="main-content">
                <h4>Search results for <b>{this.props.app.queryString}</b></h4>
                {taskList}
                {driveList}
            </div>
        )
    }
}


SearchResults.propTypes = {
    search: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        search: state.search,
        app: state.app
    };
}


export default connect(mapStateToProps)(SearchResults)