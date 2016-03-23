import React, { Component } from 'react'
import IconButton from 'material-ui/lib/icon-button';

class CompletedItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            hidden: true
        }
    }

    onMouseEnter() {
        this.setState({
            hidden: false
        })
    }

    onMouseLeave() {
        this.setState({
            hidden: true
        })
    }

    render() {
        let taskActionClass = "task-actions"
        if (this.state.hidden) {
            taskActionClass = taskActionClass + " invisible"
        }

        return (
            <li onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
                <div className="completed-content">
                    {this.props.text}
                </div>
                <div className={taskActionClass}>
                    <i className="material-icons reopen-task" onClick={this.props.reopen}>undo</i>
                </div>
            </li>
        )
    }
}

class CompletedRow extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            hidden: true
        }
    }

    toggle() {
        this.setState({
            hidden: !this.state.hidden
        })  
    }

    reopen(taskId) {
        this.props.actions.reopenTask(taskId)
    }

    render() {       
        let rows = this.props.completedTasks.map(task =>
           <CompletedItem
               key={_.uniqueId('completed')}
               text={task.content}
               reopen={this.reopen.bind(this, task.id)}
           />
        )

        let list = null

        if (!this.state.hidden) {
            list = (
                <ul>
                    {rows}
                </ul>
            )
        }
        
        return (
            <div className="completed-task-list">
                <div className="completed-text" onClick={this.toggle.bind(this)}>
                    {this.props.completedTasks.length + ' completed'}
                </div>
                {list}
            </div>
        )
    }
}

export default CompletedRow