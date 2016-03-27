import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import MilestoneRow from './MilestoneRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import TaskRow from './TaskRow.jsx'
import Remove from './../icons/Remove.jsx'
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import MilestoneModal from './MilestoneModal.jsx'

class MilestoneView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isDialogOpen: false
        }
    }

    handleClose() {
        this.setState({
            isDialogOpen: false
        })
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    addMilestone(content, deadline) {
        this.props.actions.createMilestone({
            id: _.uniqueId('milestone'),
            content: content,
            deadline: deadline,
            project_id: this.props.projectId,
            tasks: []
        })
    }

    addTask(milestone_id, content, assignee_id) {
        let task = {
            id: _.uniqueId('task'), //temp id
            content: content,
            project_id: this.props.projectId,
            assignee_id: assignee_id,
            milestone_id: milestone_id
        }
        this.props.actions.addTask(task);
    }

    editTask(task_id, content, assignee) {
        this.props.actions.editTask(task_id, content, assignee)
    }

    editMilestone(milestone_id, content, deadline) {
        this.props.actions.editMilestone(milestone_id, content, deadline)
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
            task.milestone_id === milestone_id && task.completed_on);
    }

    render() {
        let rows = [];
        let milestones = this.props.milestones
        if (milestones.length === 0 || (milestones[0].id !== null)) {
            milestones.unshift({  // Just a placeholder milestone for tasks without milestones
                content: 'Uncategorized',
                deadline: null,
                key: 'uncategorized-tasks',
                id: null
            })
        }

        this.props.milestones.forEach(milestone => {
            let onDelete = false
            let onEdit = false
            if (milestone.id) {
                onDelete = this.deleteMilestone.bind(this, milestone.id)
                onEdit = this.editMilestone.bind(this, milestone.id)
            }
            rows.push(<MilestoneRow
                content={milestone.content}
                deadline={milestone.deadline}
                id={milestone.id}
                key={milestone.id}
                onAddTask={this.addTask.bind(this, milestone.id)}
                onEditMilestone={onEdit}
                onDeleteMilestone={onDelete}
                users={this.props.users}
            />)

            let tasks = []
            this.props.tasks.forEach(task => {
                // Only show non-completed tasks and non-dirtied tasks
                if (!task.completed_on &&
                    task.dirty !== true &&
                    task.milestone_id === milestone.id) {
                    let assignees = this.props.users.filter(user => user.id === task.assignee_id)
                    tasks.push(<TaskRow
                        key={_.uniqueId('task')}
                        task={task}
                        onCheck={this.markDone.bind(this, task.id)}
                        onEdit={this.editTask.bind(this, task.id)}
                        assignees={assignees}
                        users={this.props.users}
                    />)
                }
            }) // task.forEach

            rows.push(<ul key={_.uniqueId()}>{tasks}</ul>)

            let completedTasks = this.getCompletedTasks(milestone.id)
            if (completedTasks.length > 0) {
                rows.push(<CompletedRow
                    key={_.uniqueId('completed')}
                    completedTasks={completedTasks}
                    actions={this.props.actions}
                />)
            }
        }); // milestones.forEach

        let buttonClassName = "add-milestone-btn "

        if (milestones.length === 1 && this.props.tasks.length === 0) {
            buttonClassName += "animated infinite pulse"
            var empty = (
                <div className="no-items todo-empty">
                    <h3>Your to-do list is empty!</h3>
                    <p>Add something to get started</p>
                </div>
            )
        }

        return (
        <Paper zDepth={1}>
            <div className='milestone-view'>
                <FlatButton
                    key="add-milestone-btn"
                    label="Add Milestone"
                    className={buttonClassName}
                    onTouchTap={this.openModal.bind(this)}
                    secondary={true}/>
                <div className='task-list'>
                    {rows}
                    {empty}
                </div>
            </div>
            <MilestoneModal
                key="add-milestone-modal"
                title="Add Milestone"
                open={this.state.isDialogOpen}
                handleClose={this.handleClose.bind(this)}
                method={this.addMilestone.bind(this)}
            />
        </Paper>
        );
    }
}

export default MilestoneView;