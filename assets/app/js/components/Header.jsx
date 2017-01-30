import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';
import AutoComplete from 'material-ui/AutoComplete';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../myTheme'
import Code from '../icons/Code.jsx'
import {logout} from '../utils/auth.js'
import UserAvatar from './UserAvatar.jsx'

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
        return { muiTheme: getMuiTheme(MyRawTheme) }
    }

    componentDidMount() {
        if (!this.state.isHangoutBtnRendered && $('#hangouts-btn-placeholder').length) {
            var interval = setInterval(function() {
                if (gapi && gapi.hangout) {
                    clearInterval(interval)
                    gapi.hangout.render('hangouts-btn-placeholder', { 'render': 'createhangout' });
                    this.setState({
                        isHangoutBtnRendered: true
                    })
                } else {
                }
            }.bind(this), 1000)
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

        let image = (
          <UserAvatar
            imgSrc={localStorage.getItem('display_image')}
            displayName={this.props.displayName}
          />
        );
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
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className='container-fluid'>
                <div className="navbar-header collab-logo">
                    <button type="button" className="navbar-toggle collapsed " data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                    <a className='navbar-brand'>Collab</a>
                </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">


                    <ul className="nav navbar-nav navbar-left header-left">
                        <li className='search-box' id='search'>
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
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <div id="hangouts-btn-wrapper">
                                <div id="hangouts-btn-placeholder"></div>
                            </div>
                        </li>
                        <li className="notif-li"><Link to="/app/notifications">Notifs  &nbsp;
                            {notifsCount}</Link></li>
                        <li className="display-pic-li">{image}</li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle"
                               data-toggle="dropdown"
                               role="button"
                               aria-haspopup="true"
                               aria-expanded="false">{this.props.displayName} <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                <li><a href="#" onClick={logout}>Log Out</a></li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header
