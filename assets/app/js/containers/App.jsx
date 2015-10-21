import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TaskPanel from '../components/TaskPanel.jsx';
import * as Actions from '../actions/ReduxTaskActions';
import Header from '../components/Header.jsx';

class App extends Component {
    constructor(props, context) {
        super(props, context); 

    }    

    loadProject(project_id) {
        console.log('loading project ' + project_id)
    }

    getMilestoneIds(milestones) {
        let ids = [];
        milestones.forEach(milestone => ids.push(milestone.id));
        return ids;
    }


    render() {
        const {app, milestones, notifications, projects, tasks, users, dispatch} = this.props;
        const actions = bindActionCreators(Actions, dispatch);

        let displayName = users.filter(
            user => user.id === app.current_user)[0].display_name;

        let projectName = projects.filter(
            proj => proj.id === app.current_project)[0].content;

        let milestonesInProj = milestones.filter(
            milestone => milestone.project_id === app.current_project);

        let milestoneIds = this.getMilestoneIds(milestonesInProj)

        let tasksInProj = tasks.filter(
            task => milestoneIds.includes(task.milestone_id));

        return (
            <div>
                <Header notifs={notifications} projects={projects} displayName={displayName} />
                <TaskPanel 
                milestones={milestonesInProj} 
                tasks={tasksInProj} 
                actions={actions} 
                projectName={projectName}
                projectId={app.current_project}
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