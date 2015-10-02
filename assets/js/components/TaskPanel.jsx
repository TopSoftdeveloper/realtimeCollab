var React = require('react');
var TaskStore = require('../stores/TaskStore');
var TaskService = require('../services/TaskService');
var $ = require('jquery');
var _ = require('lodash');

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

var TaskRow = React.createClass({
    render: function () {
        var dateStr = "";
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
});

var TaskTable = React.createClass({
    getInitialState: function() {
        return {milestones:[]};
    },
    componentDidMount: function() {
        TaskStore.addChangeListener(this._onChange);
        TaskService.loadTasks();
    },
    componentWillUnmount: function() {
        TaskStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TaskStore.getList());
    },
    addTask: function(e) {
        var milestone_name = this.state.inputMilestone;
        var matches = this.state.milestones.filter(function(milestone) {
            return milestone.content === milestone_name;
        });
        var milestone_id = null;
        if (matches.length !== 0) {
            milestone_id = matches[0].id;
        }
        TaskService.addTask({
            id: _.uniqueId('task'), //temp id
            milestone_id: milestone_id,
            milestone_content: milestone_name,
            content: this.state.inputTaskname,
            completed_on: null
        });

        this.setState({
            inputTaskname: '',
            inputMilestone: ''
        });

        e.preventDefault();
    },
    deleteTask: function(task_id) {
        TaskService.deleteTask(task_id);
    },
    markDone: function(task_id) {
        TaskService.markDone(task_id);
    },
    handleTaskNameChange: function(e) {
        this.setState({
            inputTaskname: e.target.value
        });
    },
    handleMilestoneChange: function(e) {
        this.setState({
            inputMilestone: e.target.value
        });
    },
    getCompletedTasks: function(milestone_id) {
        var curr_milestone = this.state.milestones.filter(function(elem) {
            return elem.id === milestone_id;
        })[0];
        return curr_milestone.tasks.filter(function(task) {
            return task.completed_on !== null;
        }.bind(this));
    },
    render: function() {
        var rows = [];
        this.state.milestones.forEach(function(milestone) {
            rows.push(<MilestoneRow
                milestone={milestone.content}
                key={_.uniqueId('milestone_row')}
                />);

            milestone.tasks.forEach(function(task) {
                // Only show non-completed tasks
                // For completed tasks, keep track of the number
                if (task.completed_on === null) {
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
            <div>            
                <table>
                    <tbody>{rows}</tbody>
                </table>
                <form className='addTask-form' onSubmit={this.addTask}>
                    <div className='input-group'>
                        <input type="text" placeholder="Submit report..." 
                            value={this.state.inputTaskname} onChange={this.handleTaskNameChange} />

                        <input type="text" placeholder="Milestone name" 
                            value={this.state.inputMilestone} onChange={this.handleMilestoneChange} />
                        
                        <span className='input-group-btn addTask-btn'>
                            <button className='btn btn-default'>Add Task</button>
                        </span>      
                    </div>              
                </form>                 
            </div>
        );
    }
});


$(window).bind("load", function() {
    React.render(<TaskTable />, document.getElementById('task-panel'));
});