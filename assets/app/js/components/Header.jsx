import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import {logout} from '../utils/auth.js'
import {getUserAvatar} from '../utils/general'
import AutoComplete from 'material-ui/lib/auto-complete';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../myTheme';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import _ from 'lodash'

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

    query(queryString) {
        if (queryString.length >= 3) this.props.actions.queryIntegrations(queryString)
    }

    render() {
        let WIDTH = '100%'
        var elem = document.getElementById('search')
        let width = '474px'
        if (elem && elem.offsetWidth) {
            width = elem.offsetWidth + 'px'
        }
        let listStyles = {
            minWidth: width,
            maxHeight: '450px',
            fontSize: '10px',
            overflowX: 'hidden'
        }
        let styles = {
            width: WIDTH
        }

        let itemStyles = {
            fontSize: '14px',
            marginLeft: '0',
            paddingLeft: '50px',
            paddingRight: '0',
            paddingBottom: '10px',
            paddingTop: '10px',
            width: '90%',
            color: 'white'
        }

        let image = getUserAvatar(localStorage.getItem('display_image'), this.props.displayName)
        let searchResults = this.props.search.map(result => {
            return {
                text: result.primaryText,
                value: (
                    <ListItem
                        key={_.uniqueId('search')}
                        leftAvatar={<Avatar size={24} src={result.thumbnail} />}
                        primaryText={result.primaryText}
                        innerDivStyle={itemStyles}
                    />
                )
            }
        })

        return (
            <nav className="navbar navbar-default ">
                <div>
                    <div className="navbar-left search-box" id="search">
                        <AutoComplete
                            hintText="Search Collab"
                            disableFocusRipple={false}
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={searchResults}
                            onUpdateInput={this.query.bind(this)}
                            listStyle={listStyles}
                            style={styles}
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