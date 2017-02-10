import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Notification from '../components/Notification/Notification.jsx'

const mapStateToProps = (state) => {
  return {
      notifications: state.notifications,
      users: state.users
  };
}

export default connect(mapStateToProps)(Notification)
