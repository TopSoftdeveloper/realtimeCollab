import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MSnackbar from 'material-ui/Snackbar';

import {updateSnackbar}  from '../actions/ReduxTaskActions'

class Snackbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
    render() {
      console.log('Snackbar::render()')
      const {snackbar, onRequestClose} = this.props
        return (
          <MSnackbar
              open={snackbar.isOpen}
              message={snackbar.message}
              autoHideDuration={3500}
              bodyStyle={{background: snackbar.background}}
              onRequestClose={onRequestClose}
          />
        )
    }
}
Snackbar.propTypes = {
  snackbar: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => {
  return {
    snackbar: state.snackbar
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onRequestClose: () => {
      dispatch(updateSnackbar({isOpen: false}))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar)
