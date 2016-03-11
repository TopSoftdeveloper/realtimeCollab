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

let RATE_LIMIT_MS = 500
let MIN_SEARCH_CHARS = 2

class Header extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isHangoutBtnRendered: false,
            lastQuery: new Date().getTime(),
            queryString: ''
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
        let elapsedTime = new Date().getTime() - this.state.lastQuery
        if (queryString.length >= MIN_SEARCH_CHARS && elapsedTime >= RATE_LIMIT_MS) {
            this.props.actions.queryIntegrations(queryString)
            this.setState({
                lastQuery: new Date().getTime(),
                queryString: queryString
            })
        }
    }

    goToResult(link, e) {
        e.preventDefault();
        window.open(link, '_newtab')
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
        let searchResults = null
        if (this.props.search.length === 0 && this.state.queryString.length >= MIN_SEARCH_CHARS) {
            searchResults = [{
                text: "",
                value: (
                    <ListItem primaryText="There are no results that match your search" disabled={true} />
                )
            }]
        } else {
            searchResults = this.props.search.map(result => {
                return {
                    text: result.primaryText,
                    value: (
                        <ListItem
                            key={_.uniqueId('search')}
                            leftAvatar={<Avatar size={24} src={result.thumbnail} />}
                            primaryText={result.primaryText}
                            innerDivStyle={itemStyles}
                            onTouchTap={this.goToResult.bind(this, result.link)}
                        />
                    )
                }
            })
        }
        return (
            <nav className="navbar navbar-default ">
                <div>
                    <div className="navbar-left search-box" id="search">
                        <AutoComplete
                            hintText="Search Collab"
                            disableFocusRipple={false}
                            filter={AutoComplete.noFilter}
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