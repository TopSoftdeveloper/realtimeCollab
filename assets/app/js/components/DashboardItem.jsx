import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';

const styles = {
  checkboxRowColumn: {
    width: '8%',
  },
  kindRowColumn: {
    width: '30%',
  },
  labelStyle: {
    fontWeight: 'normal',
    textOverflow: 'ellipis',
  },
};
const propTypes = {
  task: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  milestoneName: PropTypes.string,
  onCheck: PropTypes.func.isRequired,
};
const DashboardItem = ({ task, projectId, projectName, milestoneName, onCheck }) => {
  const check = () => {
    onCheck(task.id, projectId);
  };
  let kind = projectName;
  if (milestoneName) {
    kind += ` • ${milestoneName}`;
  }
  return (
    <TableRow selectable={false}>
      <TableRowColumn style={styles.checkboxRowColumn} >
        <Checkbox
          onCheck={check}
          labelStyle={styles.labelStyle}
        />
      </TableRowColumn >
      <TableRowColumn >
        {task.content}
      </TableRowColumn>
      <TableRowColumn
        style={styles.kindRowColumn}
      >
        <Chip labelStyle={styles.labelStyle}>{kind}</Chip>
      </TableRowColumn>
    </TableRow>
  );
};
DashboardItem.propTypes = propTypes;

export default DashboardItem;
