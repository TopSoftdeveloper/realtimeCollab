import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Settings from '../components/Settings.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    alerts: state.alerts,
    repos: state.githubRepos,
  }
}

export default connect(mapStateToProps)(Settings)
