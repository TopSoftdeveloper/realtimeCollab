import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { toAbsoluteFuzzyTime } from '../../utils/general';

const styles = {
  notifIcon: {
    fontSize: 18,
    fontWeight: '300',
  },
  subHeader: {
    paddingLeft: 5,
  },
  container: {
    fontSize: 13,
    padding: 5,
    marginLeft: 10,
  },
  content: {
    fontWeight: '100',
  },
};
const propTypes = {
  message: PropTypes.object.isRequired,
};

const SystemMssage = ({ message }) => (
  <Row style={styles.container}>
    <Col xs={1}>
      <i style={styles.notifIcon} className="material-icons">notifications</i>
    </Col>
    <Col style={styles.content} xs={11}>
      {message.content} {toAbsoluteFuzzyTime(message.created_at)}
    </Col>
  </Row>
);

SystemMssage.propTypes = propTypes;
export default SystemMssage;
