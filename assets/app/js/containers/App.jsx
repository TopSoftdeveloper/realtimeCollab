import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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

    switchToProject(project_id) {
        this.props.dispatch({
            type: AppConstants.SWITCH_TO_PROJECT,
            project_id: project_id
        })
    }

    render() {
        const {notifications, projects, users, dispatch} = this.props;
        const actions = bindActionCreators(Actions, dispatch);

        if (users.length == 0) {
            return (<div><Hydrate actions={actions} /></div>);
        } 


        let displayName = users.filter(
            user => user.id === sessionStorage.getItem('user_id'))[0].display_name;

        return (
            <div>
            <Header 
                notifs={notifications} 
                projects={projects} 
                displayName={displayName} 
                switchProject={this.switchToProject.bind(this)}
                onCreateProject={actions.createProject}
            />
            {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired            
};

function mapStateToProps(state) {
    return {
        notifications: state.notifications,
        projects: state.projects,
        users: state.users        
    };
}

export default connect(mapStateToProps)(App)