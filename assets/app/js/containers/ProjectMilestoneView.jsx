import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/ReduxTaskActions';
import MilestoneView from '../components/MilestoneView.jsx'

const mapStateToProps = (state, ownProps) => {

  return {
    milestones: state.milestones.filter(milestone => milestone.project_id === ownProps.projectId),
    tasks: state.tasks.filter(task => task.project_id === ownProps.projectId),
  }
}

export default connect(mapStateToProps)(MilestoneView)
