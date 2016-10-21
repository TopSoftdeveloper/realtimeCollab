import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {getProjectEvents} from '../selector'

import Newsfeed from '../components/Newsfeed/Newsfeed.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    events: getProjectEvents(state)
  }
}


export default connect(mapStateToProps)(Newsfeed)
