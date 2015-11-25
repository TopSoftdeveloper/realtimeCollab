import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TaskPanel from '../components/TaskPanel.jsx';
import * as Actions from '../actions/ReduxTaskActions';
import Header from '../components/Header.jsx';

var AppConstants = require('../AppConstants');

class Hydrate extends Component {
    constructor(props, context) {
        super(props, context); 
        this.props.actions.initializeApp();
    }    

    render() {        
        return (
            <div>
            </div>
        );
    }
}

class App extends Component {
    constructor(props, context) {
        super(props, context); 
    }    

    getMilestoneIds(milestones) {
        let ids = [];
        milestones.forEach(milestone => ids.push(milestone.id));
        return ids;
    }

    switchToProject(project_id) {
        this.props.dispatch({
            type: AppConstants.SWITCH_TO_PROJECT,
            project_id: project_id
        })
    }

    isItemPresent(arr, id) {
        return arr.indexOf(id) >= 0;
    }

    render() {
        const {app, milestones, notifications, projects, tasks, users, dispatch} = this.props;
        const actions = bindActionCreators(Actions, dispatch);

        if (users.length == 0) {
            return (<div><Hydrate actions={actions} /></div>);
        } 


        let displayName = users.filter(
            user => user.id === sessionStorage.getItem('user_id'))[0].display_name;

        let projectName = '';
        let basicUsers = [];
        let pendingUsers = [];
        let projectCreator = {};

        if (projects.length > 0) {
            let currentProjectMatches = projects.filter(
                proj => proj.id === app.current_project);
            if (currentProjectMatches.length === 1) {
                projectName = currentProjectMatches[0].content;
                let basicUserIds = currentProjectMatches[0].basic;
                let pendingUserIds = currentProjectMatches[0].pending;

                projectCreator = users.filter(
                    user  => currentProjectMatches[0].creator === user.id)[0];
                basicUsers = users.filter(
                    user => this.isItemPresent(basicUserIds, user.id));
                pendingUsers = users.filter(
                    user => this.isItemPresent(pendingUserIds, user.id));
            }
        } 

        let milestonesInProj = milestones.filter(
            milestone => milestone.project_id === app.current_project);

        let milestoneIds = this.getMilestoneIds(milestonesInProj)

        let tasksInProj = tasks.filter(
            task => this.isItemPresent(milestoneIds, task.milestone_id));

        return (
            <div>
                <Header 
                notifs={notifications} 
                projects={projects} 
                displayName={displayName} 
                switchProject={this.switchToProject.bind(this)}
                onCreateProject={actions.createProject}
                />

                <TaskPanel 
                milestones={milestonesInProj} 
                tasks={tasksInProj} 
                actions={actions} 
                projectName={projectName}
                projectId={app.current_project}
                basicUsers={basicUsers}
                pendingUsers={pendingUsers}
                projectCreator={projectCreator}
                />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,    
    milestones: PropTypes.array.isRequired,
    notifications: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired            
};

function mapStateToProps(state) {
    return {
        app: state.app,        
        milestones: state.milestones,
        notifications: state.notifications,
        projects: state.projects,
        tasks: state.tasks,
        users: state.users        
    };
}


export default connect(mapStateToProps)(App)