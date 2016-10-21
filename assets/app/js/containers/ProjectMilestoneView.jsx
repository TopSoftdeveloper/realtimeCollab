import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MilestoneView from '../components/MilestoneView.jsx'
import {getProjectMilestones, getProjectTasks} from '../selector'

const mapStateToProps = (state, ownProps) => {
  return {
    milestones: getProjectMilestones(state),
    tasks: getProjectTasks(state),
  }
}

export default connect(mapStateToProps)(MilestoneView)
