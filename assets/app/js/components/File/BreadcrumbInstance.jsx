import React, { PropTypes } from 'react';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

const propTypes = {
  directories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  changeDirectory: PropTypes.func.isRequired,
};

const BreadcrumbInstance = ({ directories, changeDirectory }) => {
  const breadcrumbItems = directories.map((directory, index) => {
    const isCurrentItem = index === directories.length - 1;
    return (
      <BreadcrumbItem
        active={isCurrentItem}
        onClick={!isCurrentItem ? (() => { changeDirectory(directory.id); }) : undefined}
        href={isCurrentItem ? 'dsfa' : undefined}
        key={`breadcrumb_${directory.id}`}
      >
        {directory.name}
      </BreadcrumbItem>
    );
  });
  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
};

BreadcrumbInstance.propTypes = propTypes;

export default BreadcrumbInstance;
