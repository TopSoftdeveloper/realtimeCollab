import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


const mapStateToProps = (state, ownProps) => {
  return {
    events: state.newsfeed.filter(event => event.project_id === ownProps.project.id)
  }
}


export default connect(mapStateToProps)(Newsfeed)
