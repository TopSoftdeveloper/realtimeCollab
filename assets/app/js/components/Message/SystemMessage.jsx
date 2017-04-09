import React, { PropTypes } from 'react';
import { Row, Col, Label } from 'react-bootstrap';

import { toAbsoluteFuzzyTime } from '../../utils/general';
import { systemMessageTypes } from '../../../../../server/constants.js';
import ClippedText from '../Common/ClippedText.jsx';

const primaryColor = 'rgb(96, 192, 220)';
const styles = {
  notifIcon: {
    fontSize: 18,
    fontWeight: '300',
  },
  subHeader: {
    paddingLeft: 5,
  },
  container: {
    fontSize: 12,
    padding: 2,
    marginLeft: 1,
  },
  content: {
    verticalAlign: 'middle',
  },
  userName: {
  },
  milestoneContent: {
    color: primaryColor,
    fontWeight: 500,
  },
  taskContent: {
    color: primaryColor,
    fontWeight: 500,
  },
  fromContent: {
    color: 'rgba(199, 37, 78, 1)',
    fontWeight: 500,
    textDecoration: 'line-through',
  },
  toContent: {
    color: primaryColor,
    fontWeight: 500,
  },
};
const propTypes = {
  message: PropTypes.object.isRequired,
};

// convert message data to html elements by message type
const contentMatcher = (message) => {
  const type = message.content;
  if (!message.data) {
    return false;
  }
  let data;
  let output;
  try {
    data = JSON.parse(message.data);
  } catch (e) {
    return false;
  }
  switch (type) {
    case systemMessageTypes.CREATE_MILESTONE:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span > created [Milestone] </span>
          <ClippedText
            text={data.milestone.content}
            limit={40}
            placement="bottom"
            textStyle={styles.milestoneContent}
          />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.DELETE_MILESTONE:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> deleted [Milestone] </span>
          <ClippedText
            text={data.milestone.content}
            limit={40}
            placement="bottom"
            textStyle={styles.milestoneContent}
          />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.CREATE_TASK:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span > created [Task] </span>
          <ClippedText
            text={data.task.content}
            limit={40}
            placement="bottom"
            textStyle={styles.taskContent}
          />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.MARK_TASK_AS_DONE:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> marked [Task] </span>
          <ClippedText
            text={data.task.content}
            limit={40}
            placement="bottom"
            textStyle={styles.taskContent}
          />
          <span> as completed </span>
          {toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.DELETE_TASK:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> deleted [Task] </span>
          <ClippedText
            text={data.task.content}
            limit={40}
            placement="bottom"
            textStyle={styles.taskContent}
          />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.EDIT_TASK_CONTENT:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> renamed [Task] </span>
          <ClippedText
            text={data.task.originalContent}
            limit={30}
            placement="bottom"
            textStyle={styles.fromContent}
          />
         &nbsp;to&nbsp;
         <ClippedText
           text={data.task.updatedContent}
           limit={30}
           placement="bottom"
           textStyle={styles.toContent}
         />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.REOPEN_TASK:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> reopened [Task] </span>
          <ClippedText
            text={data.task.content}
            limit={40}
            placement="bottom"
            textStyle={styles.taskContent}
          />
          &nbsp;
          {toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.REASSIGN_TASK_TO_MILESTONE:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> moved [Task] </span>
          <ClippedText
            text={data.task.content}
            limit={30}
            placement="bottom"
            textStyle={styles.taskContent}
          />
        &nbsp;from&nbsp;[Milestone]&nbsp;
          <ClippedText
            text={data.task.originalMilestone.content}
            limit={30}
            placement="bottom"
            textStyle={styles.fromContent}
          />
          &nbsp;to&nbsp;[Milestone]&nbsp;
         <ClippedText
           text={data.task.updatedMilestone.content}
           limit={30}
           placement="bottom"
           textStyle={styles.toContent}
         />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.REASSIGN_TASK_TO_USER: {
      const taskName = (
        <ClippedText
          text={data.task.content}
          limit={30}
          placement="bottom"
          textStyle={styles.taskContent}
        />
      );
      if (data.task.originalAssignee.display_name && data.task.updatedAssignee.display_name) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> reassgined [Task] {taskName} from&nbsp;
              <span style={styles.fromContent}>
                {data.task.originalAssignee.display_name}</span>
              &nbsp;to&nbsp;
              <span style={styles.toContent}>
                {data.task.updatedAssignee.display_name}</span>

            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else if (data.task.originalAssignee.display_name && !data.task.updatedAssignee.display_name) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> unassgined [Task] {taskName}
            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else if (!data.task.originalAssignee.display_name && data.task.updatedAssignee.display_name) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> assgined [Task] {taskName} to&nbsp;
              <span style={styles.toContent}>
                {data.task.updatedAssignee.display_name}</span>
            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else {
        output = false;
      }
      break;
    }
    case systemMessageTypes.EDIT_MILESTONE_CONTENT:
      output = (
        <span style={styles.content} className="text-muted">
          <span style={styles.userName}>{data.user.display_name}</span>
          <span> renamed [Milestone] </span>
          <ClippedText
            text={data.milestone.originalContent}
            limit={30}
            placement="bottom"
            textStyle={styles.fromContent}
          />
         &nbsp;to&nbsp;
         <ClippedText
           text={data.milestone.updatedContent}
           limit={30}
           placement="bottom"
           textStyle={styles.toContent}
         />
          &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
        </span>
      );
      break;
    case systemMessageTypes.EDIT_MILESTONE_DEADLINE: {
      const milestoneTitle = (
        <ClippedText
          text={data.milestone.content}
          limit={30}
          placement="bottom"
          textStyle={styles.milestoneContent}
        />
      );
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      if (data.milestone.originalDeadline && data.milestone.updatedDeadline) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> changed the due date of [Milestone] {milestoneTitle} &nbsp;from&nbsp;
            </span>
            <span style={styles.fromContent}>
              {new Date(data.milestone.originalDeadline).toLocaleDateString('en-US', options)}
            </span>
            &nbsp;to&nbsp;
            <span style={styles.toContent}>
              {new Date(data.milestone.updatedDeadline).toLocaleDateString('en-US', options)}
            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else if (!data.milestone.originalDeadline && data.milestone.updatedDeadline) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> set the due date of [Milestone] {milestoneTitle} &nbsp;as&nbsp;
            </span>
            <span style={styles.toContent}>
              {new Date(data.milestone.updatedDeadline).toLocaleDateString('en-US', options)}
            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else if (data.milestone.originalDeadline && !data.milestone.updatedDeadline) {
        output = (
          <span style={styles.content} className="text-muted">
            <span style={styles.userName}>{data.user.display_name}</span>
            <span> removed the due date of [Milestone] {milestoneTitle}
            </span>
            &nbsp;{toAbsoluteFuzzyTime(message.createdAt)}
          </span>
        );
      } else {
        output = false;
      }
      break;
    }
    default:
      output = false;
  }
  return output;
};

const SystemMssage = ({ message }) => {
  const content = contentMatcher(message);
  if (content) {
    return (
      <Row style={styles.container}>
        <Col xs={1} />
        <Col style={styles.content} xs={11}>
          {contentMatcher(message)}
        </Col>
      </Row>
    );
  }
  return null;
};

SystemMssage.propTypes = propTypes;
export default SystemMssage;
