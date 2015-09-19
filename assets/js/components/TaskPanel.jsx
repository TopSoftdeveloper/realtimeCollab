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
                <td>{this.props.task.name}</td>
                <td>{dateStr}</td>
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
                    name: "Think about Api. Draw UML Diagrams",
                    dueDate: "1441964516",
                    isTimeSpecified: true,
                    completedDate: null
                },
                {
                    milestone: "Design Architecture",
                    name: "Submit report",
                    dueDate: "1446163200",
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Design Architecture",
                    name: "Draw architecture diagram",
                    dueDate: "1442163200",
                    isTimeSpecified: true,
                    completedDate: "1442163200"
                },
                {
                    milestone: "Week 7 Evaluation",
                    name: "Software Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Week 7 Evaluation",
                    name: "Demo path planning",
                    dueDate: null,
                    isTimeSpecified: false,
                    completedDate: null
                },
                {
                    milestone: "Week 7 Evaluation",
                    name: "Firmware Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: true,
                    completedDate: "1442163200"
                },
                {
                    milestone: "Week 7 Evaluation",
                    name: "Hardware Aspect",
                    dueDate: "1442163200",
                    isTimeSpecified: false,
                    completedDate: "1442163200"
                }
            ]
        };
    },
    addTask: function(e) {
        var taskList = this.state.taskList;
        taskList.push({
            milestone: "Week 7 Evaluation",
            name: this.state.inputTaskname,
            dueDate: null,
            isTimeSpecified: false,
            completedDate: null
        });

        this.setState({
            taskList: taskList,
            inputTaskname: ''
        });

        e.preventDefault();
    },
    markDone: function(index) {
        var taskList = this.state.taskList;
        var task = taskList[index];
        task.completedDate = (new Date().getTime()/1000).toString();
        this.setState({
          taskList: taskList
        });
    },
    handleChange: function(e) {
        this.setState({
            inputTaskname: e.target.value
        });
    },
    render: function() {
        var rows = [];
        var lastMilestone = null;
        var completedTasks = 0;

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
                            value={this.state.inputTaskname} onChange={this.handleChange} />
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