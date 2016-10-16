import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/ReduxTaskActions';
import ProjectMilestoneView from '../containers/ProjectMilestoneView.jsx'
import ProjectFileView from '../containers/ProjectFileView.jsx'
import ProjectNewsfeedView from '../containers/ProjectNewsfeedView.jsx'
import ProjectSettingView from '../containers/ProjectSettingView.jsx'
import _404 from './_404.jsx'

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
        const {projects, users, dispatch, app } = this.props
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

        // Set the active tab
        let currentTab = getCurrentTab()
        if (currentTab === '') currentTab = AppConstants.PATH.milestones //default tab

        // let repoName = currentProject.github_repo_name
        // let repoOwner = currentProject.github_repo_owner
        // let repoSet = repoName && repoOwner

        return (
            <div className="main-content">
                <Tabs value={currentTab}>
                    <Tab label="Milestones"
                         value={AppConstants.PATH.milestones}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.milestones)}>
                        <ProjectMilestoneView
                            actions={actions}
                            projectId={currentProjectId}
                            users={allActiveUsers}
                        />
                    </Tab>
                    <Tab label="Files"
                         value={AppConstants.PATH.files}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.files)}>
                        <ProjectFileView
                            project={currentProject}
                            actions={actions}
                            app={app}
                        />
                    </Tab>
                    <Tab label="Newsfeed"
                         value={AppConstants.PATH.newsfeed}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.newsfeed)}>
                        <ProjectNewsfeedView
                            project={currentProject}
                            app={app}
                            users={allActiveUsers}
                        />
                    </Tab>
                    <Tab label="Settings"
                         value={AppConstants.PATH.settings}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.settings)}>
                        <ProjectSettingView
                            project={currentProject}
                            pendingUsers={pendingUsers}
                            allActiveUsers={allActiveUsers}
                            actions={actions}
                            app={app}
                        />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}

Project.propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        app: state.app,
        projects: state.projects,
        users: state.users,
    };
}

export default connect(mapStateToProps)(Project)
