import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FileView from '../components/FileView.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    milestones: state.milestones.filter(milestone => milestone.project_id === ownProps.projectId),
    tasks: state.tasks.filter(task => task.project_id === ownProps.projectId),
    users: state.users,
  }
}

export default connect(mapStateToProps)(FileView)
