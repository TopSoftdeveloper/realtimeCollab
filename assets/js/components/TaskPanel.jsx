var React = require('react');
var TaskStore = require('../stores/TaskStore');
var TaskActions = require('../actions/TaskActions');
var $ = require('jquery');

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
            return false;
        }

        if (this.state.toShow) {
            var rows = this.props.completedTasks.map(function(task) {
                return (
                        <CompletedTask
                        key={getKey()} 
                        taskName={task.taskName}                     
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
        if (this.props.task.dueDate !== null) {
            var date = new Date(parseInt(this.props.task.dueDate) * 1000);
            dateStr = this.props.task.isTimeSpecified ?
            date.toDateString() + " @ "  + date.toLocaleTimeString() :
                date.toDateString();
        }

        return (
            <tr>
                <td width="5">
                    <input 
                        type="checkbox" 
                        onChange={this.props.onClickDone}
                    />
                </td>
                <td>{this.props.task.taskName}</td>
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

var getKey = (function() {
    var id = 0;
    return function() { return id++; };
})();

var TaskTable = React.createClass({
    getInitialState: function() {
        return TaskStore.getList();
    },
    componentDidMount: function() {
        TaskStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TaskStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TaskStore.getList());
    },
    addTask: function(e) {
        TaskActions.addTask({
            milestone: this.state.inputMilestone,
            taskName: this.state.inputTaskname,
            dueDate: null,
            isTimeSpecified: false,
            completedDate: null
        });

        this.setState({
            inputTaskname: '',
            inputMilestone: ''
        });

        e.preventDefault();
    },
    deleteTask: function(task) {
        TaskActions.deleteTask(task);
    },
    markDone: function(task) {
        TaskActions.markDone(task);
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
    sortTasks: function(a, b) {
        if (a.milestone < b.milestone) {
            return -1;
        }
        if (a.milestone > b.milestone) {
            return 1;
        } 
        return 0;
    },
    getCompletedTasks: function(milestone) {
       return this.state.taskList.filter(function(elem) {
            return elem.completedDate != null && elem.milestone === milestone;
        }); 
    },
    render: function() {
        var rows = [];
        var lastMilestone = null;

        this.state.taskList = this.state.taskList.sort(this.sortTasks);

        this.state.taskList.forEach(function(task, index) {
            // End of a milestone
            if (task.milestone !== lastMilestone) {
                if (index != 0) {               
                    rows.push(<CompletedRow 
                        key={getKey()} 
                        completedTasks={this.getCompletedTasks(lastMilestone)} 
                        />);
                }
                
                rows.push(<MilestoneRow milestone={task.milestone} key={getKey()}/>);
            }

            // Only show non-completed tasks
            // For completed tasks, keep track of the number
            if (task.completedDate === null) {
                rows.push(<TaskRow 
                    task={task} 
                    key={getKey()}
                    onClickDone={this.markDone.bind(this, task)}
                    onClickDelete={this.deleteTask.bind(this, task)}
                    />);
            } 

            lastMilestone = task.milestone;
        }.bind(this));

        rows.push(<CompletedRow 
            key={getKey()} 
            completedTasks={this.getCompletedTasks(lastMilestone)} 
            />);
        

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