import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {GITHUB_CLIENT_ID} from '../AppConstants'

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

class Github extends Component {
    constructor(props, context) {
        super(props, context)
    }

    authorize() {
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID +
        '&scopes=repo,notifications')
    }

    render() {
        return (
            <div>
                <RaisedButton
                    label="Authorize"
                    onTouchTap={this.authorize.bind(this)}
                    primary={true}
                />
            </div>
        )
    }
}

export default Github