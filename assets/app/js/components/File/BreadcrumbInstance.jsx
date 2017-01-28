import React, {PropTypes } from 'react'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'

const BreadcrumbInstance = ({directories, initUpperLevelFolder}) => {

  let breadcrumbItems = directories.map((directory, index) => {
    let isCurrentItem = index === directories.length - 1
    return  (
      <BreadcrumbItem
        active={isCurrentItem}
        onClick={!isCurrentItem ? () => {initUpperLevelFolder(directory.id)} : null}
        key={'breadcrumb'+directory.id}>
        {directory.name}
      </BreadcrumbItem>
    )
  })
  return  <Breadcrumb>{breadcrumbItems}</Breadcrumb>

}

BreadcrumbInstance.propTypes = {
  directories: PropTypes.array.isRequired,
  initUpperLevelFolder: PropTypes.func.isRequired,
};
export default BreadcrumbInstance
