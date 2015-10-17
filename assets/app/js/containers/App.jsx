import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TaskPanel from '../components/TaskPanel.jsx';
import * as TaskActions from '../actions/ReduxTaskActions';
import Header from '../components/Header.jsx';

class App extends Component {
    render() {
        const {milestones, dispatch} = this.props;
        const actions = bindActionCreators(TaskActions, dispatch);
        const mockProjects = [
            {
                id: '0f0ajw',
                content: 'FYP'
            },
            {
                id: 'jf0fas',
                content: 'CS3201'
            }
        ]
        let displayName = 'Yan Yi';

        return (
            <div>
                <Header notifCount={3} projects={mockProjects} displayName={displayName} />
                <TaskPanel milestones={milestones} actions={actions} />
            </div>
        );
    }
}

App.propTypes = {
    milestones: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        milestones: state.milestones
    };
}


export default connect(mapStateToProps)(App)