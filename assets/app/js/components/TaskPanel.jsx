import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'

//var UserStore = require('./UserStore');
//var ProjectStore = require('./ProjectStore');
//var TaskService = require('../services/TaskService');
//var UserService = require('../services/UserService');
//var ProjectService = require('../services/ProjectService');


var MilestoneRow = React.createClass({
    render: function() {
        return (<tr><th colSpan="3">{this.props.milestone}</th></tr>);
    }
});

var CompletedTask = React.createClass({
    render: function() {
        return (<tr><td>{this.props.taskName}</td></tr>);
    }
});

var CompletedRow = React.createClass({
    getInitialState: function () {
        return {
            toShow: false
        };
    },
    handleChange: function() {
        this.setState({
            toShow: !this.state.toShow
        });
    },
    render: function() {
        if (this.props.completedTasks.length == 0) {
            return (
                <tr>
                    <td></td>
                </tr>
            );
        }

        if (this.state.toShow) {
            var rows = this.props.completedTasks.map(function(task) {
                return (
                        <CompletedTask
                        key={_.uniqueId('completed_task')}
                        taskName={task.content}
                        />
                    );
            });

            return (
                <tr>
                    <td className="completed" colSpan="3" onClick={this.handleChange}>
                        showing list
                        <table>
                            <tbody>{rows}</tbody>
                        </table>
                    </td>
                </tr>);
        }

        return (
            <tr>
                <td className="completed" colSpan="3" onClick={this.handleChange}>
                    {this.props.completedTasks.length} completed
                </td>
            </tr>);
    }
});

class TaskRow extends Component {
    render() {
        let dateStr = "";
        if (this.props.task.deadline !== null) {
            dateStr = this.props.task.deadline;
        }
        return (
            <tr>
                <td width="5">
                    <input 
                        type="checkbox" 
                        onChange={this.props.onClickDone}
                    />
                </td>
                <td>{this.props.task.content}</td>
                <td>{dateStr}</td>
                <td>
                    <button 
                        type="button" 
                        className="destroy" 
                        onClick={this.props.onClickDelete}
                    >x</button></td>
            </tr>
        );
    }
}

class TaskPanel extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            inputTaskname: this.props.inputTaskname || '',
            inputMilestone: this.props.inputMilestone || ''
        };
    }
    //getInitialState: function() {
    //    return {
    //        milestones:[],
    //        project_id: null
    //    };
    //},

    //componentWillUnmount: function() {
    //    TaskStore.removeChangeListener(this._onChange);
    //    UserStore.removeChangeListener(this._onChange);
    //},
    //_onChange: function() {
    //    var project_id = null;
    //    if (ProjectStore.getProjects().length > 0) {
    //        project_id = ProjectStore.getProjects()[0].id;
    //    }
    //    this.setState({
    //        milestones: TaskStore.getList(),
    //        project_id: project_id
    //    });
    //    if (!UserStore.getJwt()) {
    //        window.location.replace('http://localhost:4000/');
    //    }
    //},
    addTask(e) {
        e.preventDefault();
        let milestone_name = this.state.inputMilestone.trim();
        let matches = this.props.milestones.filter(
            milestone => milestone.content === milestone_name
        );
        let milestone_id = _.uniqueId('milestone');
        if (matches.length !== 0) {
            milestone_id = matches[0].id;
        }

        this.props.actions.addTask(milestone_id, {
            id: _.uniqueId('task'), //temp id
            deadline: null,
            is_time_specified: false,
            content: this.state.inputTaskname.trim(),
            completed_on: null
        });
        //TaskService.addTask({
        //    id: _.uniqueId('task'), //temp id
        //    milestone_id: milestone_id,
        //    milestone_content: milestone_name,
        //    content: this.state.inputTaskname,
        //    completed_on: null
        //}, this.state.project_id);

        this.setState({
            inputTaskname: '',
            inputMilestone: ''
        });        
    }

    deleteTask(task_id) {
        this.props.actions.markAsDirty(task_id)
        // TaskService.deleteTask(task_id);
    }
    markDone(task_id) {
        this.props.actions.markDone(task_id);
        // TaskService.markDone(task_id);
    }
    handleTaskNameChange(e) {
        this.setState({
            inputTaskname: e.target.value
        });
    }
    handleMilestoneChange(e) {
        this.setState({
            inputMilestone: e.target.value
        });
    }
    getCompletedTasks(milestone_id) {
        let curr_milestone = this.props.milestones.filter(function(elem) {
            return elem.id === milestone_id;
        })[0];
        return curr_milestone.tasks.filter(function(task) {
            return task.completed_on !== null;
        }.bind(this));
    }
    render() {
        let actions = this.props.actions;
        let rows = [];
        this.props.milestones.forEach(function(milestone) {
            rows.push(<MilestoneRow
                milestone={milestone.content}
                key={_.uniqueId('milestone_row')}
                />);

            milestone.tasks.forEach(function(task) {
                // Only show non-completed tasks and non-dirtied tasks
                if (task.completed_on === null && task.dirty !== true) {
                    rows.push(<TaskRow
                        task={task}
                        key={task.id}
                        onClickDone={this.markDone.bind(this, task.id)}
                        onClickDelete={this.deleteTask.bind(this, task.id)}
                        />);
                }
            }.bind(this));

            rows.push(<CompletedRow
                key={_.uniqueId('completed')}
                completedTasks={this.getCompletedTasks(milestone.id)}
                />);

        }.bind(this));

        return (
            <div className='task-table'>
                <table>
                    <tbody>{rows}</tbody>
                </table>
                <form className='addTask-form' onSubmit={this.addTask.bind(this)}>
                    <div className='input-group'>
                        <input type="text" placeholder="Submit report..." 
                            value={this.state.inputTaskname} onChange={this.handleTaskNameChange.bind(this)} />

                        <input type="text" placeholder="Milestone name" 
                            value={this.state.inputMilestone} onChange={this.handleMilestoneChange.bind(this)} />
                        
                        <span className='input-group-btn addTask-btn'>
                            <button className='btn btn-default'>Add Task</button>
                        </span>      
                    </div>              
                </form>                 
            </div>
        );
    }
}

export default TaskPanel;