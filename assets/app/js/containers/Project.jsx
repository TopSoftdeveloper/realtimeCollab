import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/ReduxTaskActions';
import ProjectMilestoneView from './ProjectMilestoneView.jsx'
import ProjectFileView from './ProjectFileView.jsx'
import ProjectNewsfeedView from './ProjectNewsfeedView.jsx'
import ProjectSettingView from './ProjectSettingView.jsx'
import _404 from '../components/_404.jsx'

import {getCurrentTab, getProjectRoot, isItemPresent} from '../utils/general'
import {getCurrentProject, getProjectActiveUsers, getProjectPendingUsers} from '../selector'

import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import { browserHistory } from 'react-router'
let AppConstants = require('../AppConstants');

class Project extends Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    changeTab(newTab) {
        browserHistory.push(getProjectRoot() + '/' + newTab)
    }


    render() {
        console.log('Project::render()')
        const {app, actions, activeUsers, pendingUsers, currentProject} = this.props
        const currentProjectId = currentProject.id


        if (!currentProject) {
            return (<_404 />);
        }

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
                      {
                        // currentTab === AppConstants.PATH.milestones &&
                        <ProjectMilestoneView
                        projectId={currentProjectId}
                        users={activeUsers}
                        actions={actions}
                        />
                      }
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
                            users={activeUsers}
                        />
                    </Tab>
                    <Tab label="Settings"
                         value={AppConstants.PATH.settings}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.settings)}>
                        <ProjectSettingView
                            project={currentProject}
                            pendingUsers={pendingUsers}
                            allActiveUsers={activeUsers}
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
    // dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    currentProject: PropTypes.object.isRequired,
    activeUsers: PropTypes.array.isRequired,
    pendingUsers: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        currentProject: getCurrentProject(state),
        activeUsers: getProjectActiveUsers(state),
        pendingUsers: getProjectPendingUsers(state),
        app: state.app,
    };
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Project)
