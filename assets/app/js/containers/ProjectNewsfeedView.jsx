import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Newsfeed from '../components/Newsfeed/Newsfeed.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    events: state.newsfeed
  }
}


export default connect(mapStateToProps)(Newsfeed)
