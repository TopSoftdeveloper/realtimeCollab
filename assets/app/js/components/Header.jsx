import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import {logout} from '../utils/auth.js'
import {getUserAvatar} from '../utils/general'
import AutoComplete from 'material-ui/lib/auto-complete';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../myTheme';

const colors = [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Black',
    'White',
];


class Header extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isHangoutBtnRendered: false
        }

        this.constructor.childContextTypes = {
            muiTheme: React.PropTypes.object
        };
    }

    getChildContext() {
        return { muiTheme: ThemeManager.getMuiTheme(MyRawTheme) }
    }
    componentDidUpdate() {
        if (!this.state.isHangoutBtnRendered && $('#hangouts-btn-placeholder').length) {
            gapi.hangout.render('hangouts-btn-placeholder', { 'render': 'createhangout' });
            this.setState({
                isHangoutBtnRendered: true
            })
        }
    }

    render() {
        let image = getUserAvatar(localStorage.getItem('display_image'), this.props.displayName)

        return (
            <nav className="navbar navbar-default header-color">
                <div className="container-fluid">
                    <div className="navbar-left search-box">
                        <AutoComplete
                            hintText="Search..."
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={colors}
                        />
                    </div>

                    <ul className="nav navbar-nav navbar-right ">
                        <li>
                            <div id="hangouts-btn-wrapper">
                                <div id="hangouts-btn-placeholder"></div>
                            </div>
                        </li>
                        <li className="notif-li"><Link to="/app/notifications">Notifs  &nbsp;
                            <span className="badge">{this.props.unreadCount}</span></Link></li>
                        <li className="display-pic-li">{image}</li>
                        <li><span className=" navbar-text ">{this.props.displayName} </span></li>
                    </ul>
                </div>
            </nav>
        )
    }
}                            

export default Header