import React, { Component } from 'react'
import IconButton from 'material-ui/lib/icon-button';
import Checkbox from 'material-ui/lib/checkbox'
import {Grid, Row, Col} from 'react-bootstrap'

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

          <div className="task-row">
            <Grid fluid={true}>
            <Row>
              <Col xs={1}>
                <div className="task-checkbox" onClick={this.props.reopen}>
                  <Checkbox checked={true}/>
                </div>
              </Col>
              <Col xs={10}>
                <div className={taskContentClass}>
                  {this.props.text}
              </div>
              </Col>
            </Row>
            </Grid>
          </div>



        )
    }
}

class CompletedRow extends Component {
    constructor(props, context) {
        super(props, context);
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
                key={task.id}
                text={task.content}
                reopen={this.reopen.bind(this, task.id)}
                highlight={highlight}
            />
        })
        return (
            <div className="completed-task-list">
                {rows}
            </div>
        )
    }
}
export default CompletedRow
