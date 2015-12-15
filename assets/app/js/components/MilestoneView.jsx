import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import MilestoneRow from './MilestoneRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import Trash from './../icons/Trash.jsx'
import {List, ListDivider, ListItem, Checkbox, IconButton } from 'material-ui'

class MilestoneView extends Component {
    constructor(props, context) {
        super(props, context);
    }

    /****************************************************************************/
    /***************************     TASK ACTIONS       *************************/
    /****************************************************************************/

    addTask(milestone_id, content) {
        this.props.actions.addTask({
            id: _.uniqueId('task'), //temp id
            deadline: null,
            is_time_specified: false,
            content: content,
            completed_on: null,
            milestone_id: milestone_id,
            project_id: this.props.projectId
        });      
    }

    deleteTask(task_id) {
        this.props.actions.deleteTask(task_id, this.props.projectId)
    }

    deleteMilestone(milestone_id) {
        this.props.actions.deleteMilestone(milestone_id, this.props.projectId)
    }

    markDone(task_id) {
        this.props.actions.markDone(task_id, this.props.projectId);
    }

    getCompletedTasks(milestone_id) {
        return this.props.tasks.filter(task => 
            task.milestone_id === milestone_id && task.completed_on !== null);
    }

    render() {
        let rows = [];

        this.props.milestones.forEach(milestone => {
            rows.push(<MilestoneRow
                milestone={milestone.content}
                key={milestone.id}
                onAddTask={this.addTask.bind(this, milestone.id)}
                onDeleteMilestone={this.deleteMilestone.bind(this, milestone.id)}
            />)

            let tasks = []
            this.props.tasks.forEach(task => {
                // Only show non-completed tasks and non-dirtied tasks
                if (task.completed_on === null &&
                    task.dirty !== true &&
                    task.milestone_id === milestone.id) {
                    tasks.push(
                        <ListItem
                            key={_.uniqueId('task')}
                            primaryText={task.content}
                            leftCheckbox={
                                <Checkbox
                                    onCheck={this.markDone.bind(this, task.id)}
                                />
                            }
                            rightIconButton={
                                <IconButton onClick={this.deleteTask.bind(this, task.id)}>
                                    <Trash/>
                                </IconButton>
                            }
                        />)
                }
            }) // task.forEach end

            rows.push(<List key={_.uniqueId()}>{tasks}</List>)

            let completedTasks = this.getCompletedTasks(milestone.id)
            if (completedTasks.length > 0) {
                rows.push(<CompletedRow
                    key={_.uniqueId('completed')}
                    completedTasks={completedTasks}
                />)
            }

            rows.push(<ListDivider key={_.uniqueId('divider')}/>)
        });

        return (
            <div className='milestone-view'>
                <div className='task-items'>
                    {rows}
                </div>
            </div>
        );
    }
}

export default MilestoneView;