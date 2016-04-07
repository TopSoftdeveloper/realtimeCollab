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
        let taskContentClass = "completed-content"
        if (this.state.hidden) {
            taskActionClass = taskActionClass + " invisible"
        }
        if (this.props.highlight) {
            taskContentClass = taskContentClass + " highlight-yellow"
        }

        return (
            <li onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
                <div className={taskContentClass}>
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
        let toOpen = false
        let rows = this.props.completedTasks.map(task => {
            let highlightId = this.props.highlightId
            let highlight = false
            if (highlightId === task.id) {
                highlight = true
                toOpen = true
            }
            return <CompletedItem
                key={_.uniqueId('completed')}
                text={task.content}
                reopen={this.reopen.bind(this, task.id)}
                highlight={highlight}
            />
        })

        let list = null

        if (!this.state.hidden || toOpen) {
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