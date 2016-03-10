import React, { Component } from 'react'

class CompletedRow extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    render() {
        return (<div></div>)
        //
        //let rows = this.props.completedTasks.map(task =>
        //    <ListItem
        //        key={_.uniqueId('completed')}
        //        primaryText={task.content}
        //    />
        //)
        //
        //return (
        //    <List>
        //        <ListItem
        //            key={_.uniqueId('completedHeader')}
        //            primaryText={this.props.completedTasks.length + ' completed'}
        //            nestedItems={rows}
        //        />
        //    </List>
        //)
    }
}

export default CompletedRow