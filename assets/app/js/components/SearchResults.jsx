import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'lodash'
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors.js';
import FontIcon from 'material-ui/FontIcon';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import * as Actions from '../actions/ReduxTaskActions'
import Code from '../icons/Code.jsx'
import CodeFragment from './CodeFragment.jsx'
import {toFuzzyTime} from '../utils/general'
import LoadingIndicator from '../components/Common/LoadingIndicator.jsx'

class SearchResults extends Component {
    constructor() {
        super(...arguments);
    }

    goToResult(link, e) {
        e.preventDefault()
        window.open(link, '_newtab')
    }

    goToTask(result, e) {
        e.preventDefault()
        browserHistory.push('/app/project/' + result.project_id + '/milestones?highlight=' + result.id)
    }

    handleChange(event, index, value) {
        this.props.dispatch(Actions.updateAppStatus({searchFilter: value}))
    }

    render() {
        if (this.props.app.queriesInProgress > 0) {
            return (
                <div className="main-content">
                    <div className="no-items">
                        <h4>Searching for <b>{this.props.app.queryString}</b>...</h4>
                        <LoadingIndicator className="loading-indicator" />
                    </div>
                </div>
            )
        }

        let driveResults = this.props.search.filter(result => result.type === 'drive')
        let taskResults = this.props.search.filter(result => result.type === 'task')
        let githubResults = this.props.search.filter(result => result.type === 'github')

        if (driveResults.length === 0 && taskResults.length === 0 && githubResults.length === 0) {
            return (
                <div className="main-content">
                    <div className="no-items">
                        <h4>No search results for <b>{this.props.app.queryString}</b></h4>
                    </div>
                </div>
            )
        }

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

        let githubListItems = githubResults.map(result => {
            let codePreview = result.text_matches.map(match =>
                <CodeFragment fragment={match.fragment} matches={match.matches} key={_.uniqueId('code')}/>
            )
            return (
                <div key={result.id}>
                    <ListItem
                        leftAvatar={<Avatar icon={<Code />} />}
                        onTouchTap={this.goToResult.bind(this, result.link)}
                        primaryText={result.primaryText}
                        secondaryText={
                            <p>
                                {result.repo}
                            </p>
                         }
                        secondaryTextLines={1}
                    />
                    {codePreview}
                    <Divider inset={true} />
                </div>
            )
        })

        let taskList = null
        let driveList = null
        let githubList = null
        let filterMenu = null
        let filterBy = []
        if (taskResults.length > 0) {
            taskList = (
                <List subheader="Assigned Tasks">
                    {taskListItems}
                </List>
            )
            filterBy.push(<MenuItem value={"tasks"} primaryText="Assigned Tasks" key="tasks"/>)
        }

        if (githubResults.length > 0) {
            githubList = (
                <List subheader="Code">
                    {githubListItems}
                </List>
            )
            filterBy.push(<MenuItem value={"code"} primaryText="Code" key="code"/>)
        }

        if (driveResults.length > 0) {
            driveList = (
                <List subheader="Files">
                    {driveListItems}
                </List>
            )
            filterBy.push(<MenuItem value={"files"} primaryText="Files" key="files"/>)
        }

        if (filterBy.length > 1) {
            filterBy = [<MenuItem value={"all"} primaryText="All" key="all"/>, ...filterBy]
            filterMenu =
                <div className="filter-by">
                    <span>Filter </span>
                    <DropDownMenu
                        value={this.props.app.searchFilter}
                        onChange={this.handleChange.bind(this)}>
                        {filterBy}
                    </DropDownMenu>
                </div>
            if (this.props.app.searchFilter === 'tasks') {
                githubList = null
                driveList = null
            } else if (this.props.app.searchFilter === 'files') {
                githubList = null
                taskList = null
            } else if (this.props.app.searchFilter === 'code') {
                taskList = null
                driveList = null
            }
        }

        return (
            <div className="main-content">
                <h4>Search results for <b>{this.props.app.queryString}</b></h4>
                {filterMenu}
                {taskList}
                {githubList}
                {driveList}
            </div>
        )
    }
}


SearchResults.propTypes = {
    search: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        search: state.search,
        app: state.app
    };
}


export default connect(mapStateToProps)(SearchResults)
