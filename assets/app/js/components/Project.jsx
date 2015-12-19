import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/ReduxTaskActions';
import _ from 'lodash'
import ProjectHeader from './ProjectHeader.jsx'
import MilestoneView from './MilestoneView.jsx'
import _404 from './_404.jsx'
import Settings from './Settings.jsx'
import Files from './Files.jsx'
import {isProjectPresent} from '../utils/collection'
import {getCurrentProject} from '../utils/general'
import {isLoggedIntoGoogle} from '../utils/auth'
import gapi from '../gapi'

import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'


class Project extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    getMilestoneIds(milestones) {
        let ids = [];
        milestones.forEach(milestone => ids.push(milestone.id));
        return ids;
    }

    isItemPresent(arr, id) {
        return arr.indexOf(id) >= 0;
    }

    handleFileViewActive() {
        let self = this;
        isLoggedIntoGoogle(function(authResult) {
            if (authResult && !authResult.error) {
                let request = gapi.client.request({
                    'path': '/drive/v3/files',
                    'method': 'GET',
                    'params': {'pageSize': '10', 'orderBy': 'modifiedTime'}
                })
                request.then(res => {
                    self.props.dispatch(Actions.initFiles(res.result.files))

                }, function(err) {
                    console.log(err)
                });
            } else {
                console.log('auth fail. prompt for login')
            }
        })
    }

    render() {   
        const {alerts, milestones, projects, tasks, users, dispatch, files} = this.props
        const actions = bindActionCreators(Actions, dispatch)

        const currentProjectId = getCurrentProject()

        let projectName = '';
        let basicUsers = [];
        let pendingUsers = [];
        let projectCreator = '';

        if (isProjectPresent(projects, currentProjectId)) {
            let currentProject = projects.filter(proj => proj.id === currentProjectId)[0];
            let basicUserIds = currentProject.basic;
            let pendingUserIds = currentProject.pending;

            projectCreator = users.filter(user  => currentProject.creator === user.id)[0];
            basicUsers = users.filter(user => this.isItemPresent(basicUserIds, user.id));
            pendingUsers = users.filter(user => this.isItemPresent(pendingUserIds, user.id));
            projectName = currentProject.content;
        } else {
            return (<_404 />);
        }

        let milestonesInProj = milestones.filter(
            milestone => milestone.project_id === currentProjectId);

        let milestoneIds = this.getMilestoneIds(milestonesInProj);

        let tasksInProj = tasks.filter(
            task => this.isItemPresent(milestoneIds, task.milestone_id));

        return (
            <div className='task-table'>
                <ProjectHeader
                    projectName={projectName}
                    members={basicUsers}
                    actions={actions}
                />
                <Tabs>
                    <Tab label="Milestones" >
                        <MilestoneView
                            milestones={milestonesInProj}
                            tasks={tasksInProj}
                            actions={actions}
                            projectId={currentProjectId}
                        />
                    </Tab>
                    <Tab label="Files" onActive={this.handleFileViewActive.bind(this)} >
                        <Files
                            actions={actions}
                            files={files}
                        />
                    </Tab>
                    <Tab label="Settings" >
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

export default connect(mapStateToProps)(Project)