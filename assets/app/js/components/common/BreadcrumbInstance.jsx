import React, { Component, PropTypes } from 'react'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'
class BreadcrumbInstance extends Component {
  changeCurrentDirectory(directoryId) {
    this.props.initUpperLevelFolder(this.props.projectId, directoryId)
  }

  render() {
    const {directories} = this.props
    let breadcrumbItems = directories.map((directory, index) => {
      if (index === directories.length - 1) {
        return (
          <BreadcrumbItem
            active
            key={_.uniqueId('breadcrumb')}>
            {directory.name}
          </BreadcrumbItem>
        )
      }

      return (
        <BreadcrumbItem
          onClick={this.changeCurrentDirectory.bind(this, directory.id)}
          key={_.uniqueId('breadcrumb')}>
          {directory.name}
        </BreadcrumbItem>
      )
    })

    return (
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
    )
  }
}

BreadcrumbInstance.propTypes = {
  directories: PropTypes.array.isRequired,
  initUpperLevelFolder: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
};
export default BreadcrumbInstance
