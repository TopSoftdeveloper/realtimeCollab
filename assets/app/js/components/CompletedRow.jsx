import React, { Component } from 'react'

class CompletedItem extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    render() {
        return (
            <li>{this.props.text}</li>
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

    render() {       
        let rows = this.props.completedTasks.map(task =>
           <CompletedItem
               key={_.uniqueId('completed')}
               text={task.content}
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