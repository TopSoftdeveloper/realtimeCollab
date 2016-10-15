import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/ReduxTaskActions';
import ProjectMilestoneViewContainer from '../containers/ProjectMilestoneViewContainer.jsx'
import _404 from './_404.jsx'
import Settings from './Settings.jsx'
import Files from './FileView.jsx'
import Newsfeed from './Newsfeed/Newsfeed.jsx'
import {isProjectPresent} from '../utils/collection'
import {getCurrentProject, getCurrentTab, getProjectRoot, isItemPresent} from '../utils/general'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import { browserHistory } from 'react-router'
let AppConstants = require('../AppConstants');

class Project extends Component {
    constructor(props, context) {
        super(props, context);
    }

    changeTab(newTab) {
        browserHistory.push(getProjectRoot() + '/' + newTab)
    }

    render() {
        const {alerts, projects, users, dispatch, app,
            files, githubRepos, newsfeed, location} = this.props
        const actions = bindActionCreators(Actions, dispatch)

        const currentProjectId = getCurrentProject()

        let basicUsers = [];
        let pendingUsers = [];
        let projectCreator = '';
        let currentProject = null

        if (isProjectPresent(projects, currentProjectId)) {
            currentProject = projects.filter(proj => proj.id === currentProjectId)[0];
            let basicUserIds = currentProject.basic;
            let pendingUserIds = currentProject.pending;

            projectCreator = users.filter(user  => currentProject.creator === user.id)[0];
            basicUsers = users.filter(user => isItemPresent(basicUserIds, user.id));
            pendingUsers = users.filter(user => isItemPresent(pendingUserIds, user.id));
        } else {
            return (<_404 />);
        }

        let allActiveUsers = basicUsers.slice()
        if (projectCreator) allActiveUsers.push(projectCreator)

        let events = newsfeed.filter(event => event.project_id === currentProjectId)

        // Set the active tab
        let currentTab = getCurrentTab()
        if (currentTab === '') currentTab = AppConstants.PATH.milestones //default tab

        let repoName = currentProject.github_repo_name
        let repoOwner = currentProject.github_repo_owner
        let repoSet = repoName && repoOwner

        return (
            <div className="main-content">
                <Tabs value={currentTab}>
                    <Tab label="Milestones"
                         value={AppConstants.PATH.milestones}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.milestones)}>
                        <ProjectMilestoneViewContainer
                            actions={actions}
                            projectId={currentProjectId}
                        />
                    </Tab>
                    <Tab label="Files"
                         value={AppConstants.PATH.files}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.files)}>
                        <Files
                            project={currentProject}
                            actions={actions}
                            files={files}
                            app={app}
                            actions={actions}
                            dispatch={dispatch}
                        />
                    </Tab>
                    <Tab label="Newsfeed"
                         value={AppConstants.PATH.newsfeed}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.newsfeed)}>
                        <Newsfeed
                            project={currentProject}
                            app={app}
                            users={allActiveUsers}
                        />
                    </Tab>
                    <Tab label="Settings"
                         value={AppConstants.PATH.settings}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.settings)}>
                        <Settings
                            project={currentProject}
                            pendingUsers={pendingUsers}
                            allActiveUsers={allActiveUsers}
                            actions={actions}
                            alerts={alerts}
                            app={app}
                            repos={githubRepos}
                        />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}

Project.propTypes = {
    dispatch: PropTypes.func.isRequired,
    alerts: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired,
    newsfeed: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        alerts: state.alerts,
        app: state.app,
        projects: state.projects,
        users: state.users,
        files: state.files,
        githubRepos: state.githubRepos,
        newsfeed: state.newsfeed
    };
}

export default connect(mapStateToProps)(Project)
