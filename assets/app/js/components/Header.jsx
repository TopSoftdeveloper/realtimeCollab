import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import {logout} from '../utils/auth.js'
import {getUserAvatar} from '../utils/general'
import AutoComplete from 'material-ui/lib/auto-complete'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import MyRawTheme from '../myTheme'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import FontIcon from 'material-ui/lib/font-icon'
import Code from '../icons/Code.jsx'
import _ from 'lodash'
import { browserHistory } from 'react-router'

let RATE_LIMIT_MS = 900
let MIN_SEARCH_CHARS = 3

class Header extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isHangoutBtnRendered: false,
            lastQueryTime: new Date().getTime(),
            lastQueryString: '',
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

    executeQuery(queryString) {
        if (queryString.trim()) {
            this.props.actions.queryIntegrations(queryString)
            this.setState({lastQueryTime: new Date().getTime(), lastQueryString: queryString})
        }
    }

    query(queryString) {
        this.setState({queryString: queryString})
        if (queryString.length < MIN_SEARCH_CHARS) return
        let elapsedTime = new Date().getTime() - this.state.lastQueryTime
        if (elapsedTime < RATE_LIMIT_MS) {
            setTimeout(() => {
                if (this.state.queryString !== this.state.lastQueryString) {
                    this.executeQuery(this.state.queryString)
                }
            }, RATE_LIMIT_MS)
        } else {
            this.executeQuery(queryString)
        }
    }

    newRequest() {
        if (this.state.queryString !== this.state.lastQueryString) {
            this.executeQuery(this.state.queryString)
        }
        this.setState({queryString: ''})
        browserHistory.push('/app/search')
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
            let text = "There are no results that match your search"
            if (this.props.app.queriesInProgress > 0) text = "Searching..."
            searchResults = [{
                text: "",
                value: (
                    <ListItem
                        primaryText={text}
                        disabled={true}
                    />
                )
            }]

        } else {
            searchResults = this.props.search.map(result => {
                let avatar = <Avatar size={24} src={result.thumbnail} />
                if (result.type === 'github') {
                    avatar = <Avatar size={24} icon={<Code  style={{margin: '0px'}}/>} />
                }
                return {
                    text: result.primaryText + _.uniqueId('search'),
                    value: (
                        <ListItem
                            leftAvatar={avatar}
                            primaryText={result.primaryText}
                            innerDivStyle={itemStyles}
                            onTouchTap={this.goToResult.bind(this, result.link)}
                        />
                    )
                }
            })
        }

        let notifsCount = null
        if (this.props.unreadCount > 0) {
            notifsCount = <span className="badge">{this.props.unreadCount}</span>
        }

        return (
            <nav className="navbar navbar-default navbar-fixed-top container-fluid">
                <div>
                    <div className="navbar-left collab-logo">
                        <h3>Collab</h3>
                    </div>
                    <div className="navbar-left search-box" id="search">
                        <AutoComplete
                            hintText="Search Collab"
                            disableFocusRipple={false}
                            filter={AutoComplete.noFilter}
                            dataSource={searchResults}
                            onUpdateInput={this.query.bind(this)}
                            onNewRequest={this.newRequest.bind(this)}
                            listStyle={listStyles}
                            style={styles}
                            searchText={this.state.queryString}
                        />
                    </div>

                    <ul className="nav navbar-nav navbar-right ">
                        <li>
                            <div id="hangouts-btn-wrapper">
                                <div id="hangouts-btn-placeholder"></div>
                            </div>
                        </li>
                        <li className="notif-li"><Link to="/app/notifications">Notifs  &nbsp;
                            {notifsCount}</Link></li>
                        <li className="display-pic-li">{image}</li>
                        <li><span className=" navbar-text ">{this.props.displayName} </span></li>
                    </ul>
                </div>
            </nav>
        )
    }
}                            

export default Header