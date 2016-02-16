import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/ReduxTaskActions';
import MilestoneView from './MilestoneView.jsx'
import _404 from './_404.jsx'
import Settings from './Settings.jsx'
import Files from './Files.jsx'
import Github from './Github.jsx'
import {isProjectPresent} from '../utils/collection'
import {getCurrentProject, getCurrentTab, getProjectRoot, isItemPresent} from '../utils/general'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import { connectHistory } from '../components/connectHistory.jsx'
let AppConstants = require('../AppConstants');

class Project extends Component {
    constructor(props, context) {
        super(props, context);
    }

    getMilestoneIds(milestones) {
        let ids = [];
        milestones.forEach(milestone => ids.push(milestone.id));
        return ids;
    }

    changeTab(newTab) {
        this.props.history.pushState(null, getProjectRoot() + '/' + newTab)
    }

    render() {   
        const {alerts, milestones, projects, tasks, users, dispatch, app, files} = this.props
        const actions = bindActionCreators(Actions, dispatch)
        const currentProjectId = getCurrentProject()

        let projectName = '';
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
            projectName = currentProject.content;
        } else {
            return (<_404 />);
        }

        let milestonesInProj = milestones.filter(
            milestone => milestone.project_id === currentProjectId);

        let milestoneIds = this.getMilestoneIds(milestonesInProj);

        let tasksInProj = tasks.filter(
            task => isItemPresent(milestoneIds, task.milestone_id));

        let allActiveUsers = basicUsers.slice()
        if (projectCreator) allActiveUsers.push(projectCreator)

        // Set the active tab
        let currentTab = getCurrentTab()
        if (currentTab === '') currentTab = AppConstants.PATH.milestones //default tab

        return (
            <div className="main-content">
                <Tabs value={currentTab}>
                    <Tab label="Milestones"
                         value={AppConstants.PATH.milestones}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.milestones)}>
                        <MilestoneView
                            milestones={milestonesInProj}
                            tasks={tasksInProj}
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
                        />
                    </Tab>
                    <Tab label="Github"
                         value={AppConstants.PATH.github}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.github)}>
                        <Github
                            projectName={projectName}
                            projectId={currentProjectId}
                            basicUsers={basicUsers}
                            pendingUsers={pendingUsers}
                            projectCreator={projectCreator}
                            actions={actions}
                            alerts={alerts}
                        />
                    </Tab>
                    <Tab label="Settings"
                         value={AppConstants.PATH.settings}
                         onActive={this.changeTab.bind(this, AppConstants.PATH.settings)}>
                        <Settings
                            projectName={projectName}
                            projectId={currentProjectId}
                            basicUsers={basicUsers}
                            pendingUsers={pendingUsers}
                            projectCreator={projectCreator}
                            actions={actions}
                            alerts={alerts}
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
    milestones: PropTypes.array.isRequired,    
    projects: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,    
    users: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        alerts: state.alerts,
        app: state.app,
        milestones: state.milestones,
        projects: state.projects,
        tasks: state.tasks,
        users: state.users,
        files: state.files
    };
}

export default connect(mapStateToProps)(connectHistory(Project))