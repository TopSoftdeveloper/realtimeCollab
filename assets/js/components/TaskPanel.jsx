var React = require('react');
var $ = require('jquery');

var MilestoneRow = React.createClass({
    render: function() {
        return (<tr><th colSpan="3">{this.props.milestone}</th></tr>);
    }
});

var CompletedRow = React.createClass({
    render: function() {
        return (<tr><td className="completed" colSpan="3">{this.props.count} completed</td></tr>);
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
        return {
            // Assumes sorted by milestones
            taskList: [
                {
                    milestone: "Design Architecture",
                    taskName: "Think about Api. Draw UML Diagrams",
                    dueDate: "1441964516",
                    isTimeSpecified: true,
                    completedDate: null
                },
                {
                    milestone: "Design Architecture",
                    taskName: "Submit report",
                    dueDate: "1446163200",
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Design Architecture",
                    taskName: "Draw architecture diagram",
                    dueDate: "1442163200",
                    isTimeSpecified: true,
                    completedDate: "1442163200"
                },
                {
                    milestone: "Week 7 Evaluation",
                    taskName: "Software Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Week 7 Evaluation",
                    taskName: "Demo path planning",
                    dueDate: null,
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Week 7 Evaluation",
                    taskName: "Firmware Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: true,
                    completedDate: "1442163200"
                },
                {
                    milestone: "Week 7 Evaluation",
                    taskName: "Hardware Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: false,
                    completedDate: "1442163200"
                }
            ]
        };
    },
    isSameTask: function(a, b) {
        return (a.milestone === b.milestone && 
            a.taskName === b.taskName &&
            a.dueDate === b.dueDate &&
            a.isTimeSpecified === b.isTimeSpecified &&
            a.completedDate === b.completedDate);
    },
    addTask: function(e) {
        var taskList = this.state.taskList;
        taskList.push({
            milestone: this.state.inputMilestone,
            taskName: this.state.inputTaskname,
            dueDate: null,
            isTimeSpecified: false,
            completedDate: null
        });

        this.setState({
            taskList: taskList,
            inputTaskname: '',
            inputMilestone: ''
        });

        e.preventDefault();
    },
    deleteTask: function(task) {
        for (var i = 0; i < this.state.taskList.length; ++i) {
            var elem = this.state.taskList[i];
            if (this.isSameTask(task, elem)) {
                this.state.taskList.splice(i, 1);
                this.setState({
                    taskList: this.state.taskList
                });
                break;
            }            
        }
    },
    markDone: function(index) {
        var taskList = this.state.taskList;
        var task = taskList[index];
        task.completedDate = (new Date().getTime()/1000).toString();
        this.setState({
          taskList: taskList
        });
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
    render: function() {
        var rows = [];
        var lastMilestone = null;
        var completedTasks = 0;

        this.state.taskList = this.state.taskList.sort(this.sortTasks);

        this.state.taskList.forEach(function(task, index) {

            // End of a milestone
            if (task.milestone !== lastMilestone) {
                if (completedTasks > 0) {
                    rows.push(<CompletedRow count={completedTasks} key={getKey()} />);
                    completedTasks = 0;
                }
                rows.push(<MilestoneRow milestone={task.milestone} key={getKey()}/>);
            }

            // Only show non-completed tasks
            // For completed tasks, keep track of the number
            if (task.completedDate === null) {
                rows.push(<TaskRow 
                    task={task} 
                    key={getKey()}
                    onClickDone={this.markDone.bind(this, index)} 
                    onClickDelete={this.deleteTask.bind(this, task)}
                    />);
            } else {
                completedTasks++;
            }

            lastMilestone = task.milestone;
        }.bind(this));

        if (completedTasks !== 0) {
            rows.push(<CompletedRow count={completedTasks} key={getKey()} />);
        }

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