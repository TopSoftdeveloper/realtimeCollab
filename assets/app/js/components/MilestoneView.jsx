import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import MilestoneRow from './MilestoneRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import TaskRow from './TaskRow.jsx'
import Remove from './../icons/Remove.jsx'

class MilestoneView extends Component {
    constructor(props, context) {
        super(props, context);
    }

    /****************************************************************************/
    /***************************     TASK ACTIONS       *************************/
    /****************************************************************************/

    addTask(milestone_id, content) {
        let task = {
            id: _.uniqueId('task'), //temp id
            content: content,
            completed_on: null,
            project_id: this.props.projectId
        }
        if (milestone_id) task.milestone_id = milestone_id
        this.props.actions.addTask(task);
    }

    deleteTask(task_id) {
        // slight timeout for animation to take effect
        setTimeout(function() {
            this.props.actions.deleteTask(task_id, this.props.projectId)
        }.bind(this), 300)
    }

    deleteMilestone(milestone_id) {
        this.props.actions.deleteMilestone(milestone_id, this.props.projectId)
    }

    markDone(task_id) {
        // slight timeout for animation to take effect
        setTimeout(function() {
            this.props.actions.markDone(task_id, this.props.projectId)
        }.bind(this), 300)
    }

    getCompletedTasks(milestone_id) {
        return this.props.tasks.filter(task => 
            task.milestone_id === milestone_id && task.completed_on !== null);
    }

    render() {
        let rows = [];
        let tasksWithoutMilestones = this.props.tasks.filter(task => !task.milestone_id)
        if (tasksWithoutMilestones.length > 0) {
            rows.push(<MilestoneRow
                milestone={'Uncategorized'}
                deadline={null}
                key={'uncategorized-tasks'}
                onAddTask={this.addTask.bind(this, null)}
                onDeleteMilestone={false}
            />)
            tasksWithoutMilestones.forEach(task => {
                if (task.completed_on === null &&
                    task.dirty !== true) {
                    rows.push(<TaskRow
                        key={_.uniqueId('task')}
                        task={task}
                        onCheck={this.markDone.bind(this, task.id)}
                        onDelete={this.deleteTask.bind(this, task.id)}
                        />)
                }
            })

            let completedTasks = tasksWithoutMilestones.filter(task => task.completed_on !== null)
            if (completedTasks.length > 0) {
                rows.push(<CompletedRow
                    key={_.uniqueId('completed')}
                    completedTasks={completedTasks}
                />)
            }
        }

        this.props.milestones.forEach(milestone => {
            rows.push(<MilestoneRow
                milestone={milestone.content}
                deadline={milestone.deadline}
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
                    tasks.push(<TaskRow
                        key={_.uniqueId('task')}
                        task={task}
                        onCheck={this.markDone.bind(this, task.id)}
                        onDelete={this.deleteTask.bind(this, task.id)}
                    />)
                }
            }) // task.forEach end

            rows.push(<ul key={_.uniqueId()}>{tasks}</ul>)

            let completedTasks = this.getCompletedTasks(milestone.id)
            if (completedTasks.length > 0) {
                rows.push(<CompletedRow
                    key={_.uniqueId('completed')}
                    completedTasks={completedTasks}
                />)
            }
        });

        return (
            <div className='milestone-view'>
                <div className='task-list'>
                    {rows}
                </div>
            </div>
        );
    }
}

export default MilestoneView;