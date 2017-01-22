import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FileView from '../components/File/FileView.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files,
  }
}

export default connect(mapStateToProps)(FileView)
