import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import MilestoneRow from './MilestoneRow.jsx'
import CompletedRow from './CompletedRow.jsx'

class TaskRow extends Component {
    render() {
        let dateStr = "";
        if (this.props.task.deadline !== null) {
            dateStr = this.props.task.deadline;
        }
        return (
            <div className='taskrow'>
                <i className='fa fa-circle-thin' onClick={this.props.onClickDone}> </i>    
                <span className='task-content'>{this.props.task.content}</span>
                <span>{dateStr}</span>        
                <i className='fa fa-close' onClick={this.props.onClickDelete}></i>
            </div>
        );
    }
}

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
                />);

            this.props.tasks.forEach(task => {
                // Only show non-completed tasks and non-dirtied tasks
                if (task.completed_on === null && 
                    task.dirty !== true && 
                    task.milestone_id === milestone.id) {
                    rows.push(<TaskRow
                        task={task}
                        key={task.id}
                        onClickDone={this.markDone.bind(this, task.id)}
                        onClickDelete={this.deleteTask.bind(this, task.id)}
                        />);
                }
            });

            rows.push(<CompletedRow
                key={_.uniqueId('completed')}
                completedTasks={this.getCompletedTasks(milestone.id)}
                />);

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