import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { Row, Col } from 'react-bootstrap';


const propTypes = {
  reopenTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  highlight: PropTypes.bool.isRequired,
};
class CompletedTask extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hidden: true,
    };
    this.reopen = this.reopen.bind(this);
  }
  onMouseEnter() {
    this.setState({
      hidden: false,
    });
  }
  onMouseLeave() {
    this.setState({
      hidden: true,
    });
  }
  reopen() {
    this.props.reopenTask(this.props.task.id);
  }
  render() {
    let taskContentClass = 'completed-content';
    if (this.props.highlight) {
      taskContentClass += 'highlight-yellow';
    }
    return (
      <div className="task-row completed-task-row">
        <Row>
          <Col xs={11}>
            <div className="task-checkbox" onClick={this.reopen}>
              <Checkbox checked />
            </div>
            <div className={taskContentClass}>
              {this.props.task.content}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
CompletedTask.propTypes = propTypes;
export default CompletedTask;
