import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';

const styles = {
  kindRowColumn: {
    width: '30%',
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
    const maxSize = 23;
    const ellipis = '...';
    if (kind.length > maxSize) {
      kind = `${kind.slice(0, maxSize - ellipis.length - 1)}${ellipis}`;
    }
  }
  return (
    <TableRow>
      <TableRowColumn><Checkbox label={task.content} onCheck={check} /></TableRowColumn>
      <TableRowColumn
        style={styles.kindRowColumn}
      >
        <Chip>{kind}</Chip>
      </TableRowColumn>
    </TableRow>
  );
};
DashboardItem.propTypes = propTypes;

export default DashboardItem;
