import React, { Component } from 'react'

class CompletedTask extends Component {
    render() {
        return (<div><span>{this.props.taskName}</span></div>);
    }
}

class CompletedRow extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            toShow: false
        };
    }

    handleChange() {
        this.setState({
            toShow: !this.state.toShow
        });
    }
    render() {
        if (this.props.completedTasks.length === 0) {
            return (
                <div className='completed-row'></div>
            );
        }

        if (this.state.toShow) {
            let rows = this.props.completedTasks.map(task =>                    
                <span className='completed-item' key={_.uniqueId('completed')}>{task.content}</span>
            );

            return (
                <div className='completed-row'>
                    <span className="completed-text" onClick={e => this.handleChange()}> Completed </span>
                    {rows}
                </div>
                );
        }

        return (
            <div className='completed-row'>
                <span className="completed-text" onClick={e => this.handleChange()}>
                    {this.props.completedTasks.length} completed
                </span>
            </div>);
    }
}

export default CompletedRow;