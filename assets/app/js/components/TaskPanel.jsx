import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import TaskPanelHeader from './TaskPanelHeader.jsx'
import MilestoneRow from './MilestoneRow.jsx'

var CompletedTask = React.createClass({
    render: function() {
        return (<div><span>{this.props.taskName}</span></div>);
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
                <div className='completed-row'></div>
            );
        }

        if (this.state.toShow) {
            var rows = this.props.completedTasks.map(function(task) {
                return (
                        <span className='completed-item' key={_.uniqueId('completed')}>{task.content}</span>
                    );
            });

            return (
                <div className='completed-row'>
                    <span className="completed-text" onClick={this.handleChange}> Completed </span>
                    {rows}
                </div>
                );
        }

        return (
            <div className='completed-row'>
                <span className="completed-text" onClick={this.handleChange}>
                    {this.props.completedTasks.length} completed
                </span>
            </div>);
    }
});

class TaskRow extends Component {
    render() {
        let dateStr = "";
        if (this.props.task.deadline !== null) {
            dateStr = this.props.task.deadline;
        }
        return (
            <div className='taskrow'>
                <i className='fa fa-circle-thin' onClick={this.props.onClickDone}> </i>    
                <span className='task-content'>{this.props.task.content}</span>
                <span>{dateStr}</span>        
                <i className='fa fa-close' onClick={this.props.onClickDelete}></i>
            </div>
        );
    }
}

class TaskPanel extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    addTask(milestone_id, content) {
        this.props.actions.addTask(milestone_id, {
            id: _.uniqueId('task'), //temp id
            deadline: null,
            is_time_specified: false,
            content: content,
            completed_on: null
        });      
    }

    addMilestone(content) {
        this.props.actions.createMilestone({
            id: _.uniqueId('milestone'),
            content: content,
            deadline: null,
            project_id: 'NJ-5My0Jg',
            tasks: []
        });
    }

    deleteTask(task_id) {
        this.props.actions.markAsDirty(task_id)
    }

    markDone(task_id) {
        this.props.actions.markDone(task_id);
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
                key={milestone.id}
                onAddTask={this.addTask.bind(this, milestone.id)}
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
                <TaskPanelHeader projectName={this.props.projectName} onAddMilestone={this.addMilestone.bind(this)} />
                <div className='task-items'>
                    {rows}
                </div>              
            </div>
        );
    }
}

export default TaskPanel;