import React, { Component } from 'react'
import ListItem from 'material-ui/lib/lists/list-item'
import List from 'material-ui/lib/lists/list'

class CompletedRow extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    render() {

        let rows = this.props.completedTasks.map(task =>
            <ListItem
                key={_.uniqueId('completed')}
                primaryText={task.content}
            />
        )

        return (
            <List>
                <ListItem
                    key={_.uniqueId('completedHeader')}
                    primaryText={this.props.completedTasks.length + ' completed'}
                    nestedItems={rows}
                />
            </List>
        )
    }
}

export default CompletedRow