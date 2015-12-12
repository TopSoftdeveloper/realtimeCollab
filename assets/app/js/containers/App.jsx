import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import { connectHistory } from '../components/connectHistory.jsx'
import * as Actions from '../actions/ReduxTaskActions'
import Header from '../components/Header.jsx'
import {matchesUrl} from '../utils/general'

var AppConstants = require('../AppConstants');

class App extends Component {
    constructor(props, context) {
        super(props, context)
        let host = 'ws://localhost:4001/'
        let socket = io.connect(host)
        this.state = { socket }
        this.userIsOnline()
        this.monitorOnlineStatus()
        this.monitorProjectChanges()
        this.monitorNotifications()
    }      

    userIsOnline() {
        this.state.socket.emit('is_online', {user_id: sessionStorage.getItem('user_id')})
        this.props.dispatch(Actions.userOnline(sessionStorage.getItem('user_id')))
    }

    monitorOnlineStatus() {
        this.state.socket.on('teammate_online', (data) => {
            this.props.dispatch(Actions.userOnline(data.user_id));
        });        
        this.state.socket.on('teammate_offline', (data) => {
            this.props.dispatch(Actions.userOffline(data.user_id));
        });   
    }    

    monitorProjectChanges() {
        this.state.socket.on('new_task', (data) => {
            if (data.sender !== sessionStorage.getItem('user_id')) {
                this.props.dispatch(Actions._addTask(data.task));
            }
        });        
        this.state.socket.on('mark_done', (data) => {
            if (data.sender !== sessionStorage.getItem('user_id')) {
                this.props.dispatch(Actions._markDone(data.task_id));                
            }
        });     
        this.state.socket.on('delete_task', (data) => {
            if (data.sender !== sessionStorage.getItem('user_id')) {
                this.props.dispatch(Actions._deleteTask(data.task_id));                
            }
        });              
    }

    monitorNotifications() {
        this.state.socket.on('new_notification', (data) => {
            console.log(data)
        });
    }

    switchToProject(project_id) {
        this.props.dispatch({
            type: AppConstants.SWITCH_TO_PROJECT,
            project_id: project_id
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { projects } = this.props;
        if (matchesUrl(window.location.href, AppConstants.APP_ROOT_URL) && projects.length > 0) {
            // Redirect to default project (current set as project at index 0)            
            let defaultProjectId = projects[0].id;
            this.props.history.replaceState(null, '/app/project/' + defaultProjectId);   
            return false;         
        }
        return true;
    }

    render() {
        const {notifications, projects, users, dispatch} = this.props;
        const actions = bindActionCreators(Actions, dispatch);

        if (users.length === 0) {
            // First initialization of app            
            actions.initializeApp();
            return (<div></div>);
        } 

        let children = this.props.children;
        if (projects.length === 0) {
            children = (<h2>You have no projects yet!</h2>);
        }

        let displayName = users.filter(
            user => user.id === sessionStorage.getItem('user_id'))[0].display_name;

        let unreadCount = notifications.reduce((total, notif) => notif.read ? total : total+1, 0);

        return (
            <div>
            <Header 
                unreadCount={unreadCount} 
                projects={projects} 
                displayName={displayName} 
                switchProject={this.switchToProject.bind(this)}
                onCreateProject={actions.createProject}
            />
            {children}
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

export default connect(mapStateToProps)(connectHistory(App))