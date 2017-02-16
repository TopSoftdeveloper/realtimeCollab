import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import $ from 'jquery';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import AutoComplete from 'material-ui/AutoComplete';
import Code from '../icons/Code.jsx';
import { logout } from '../utils/auth.js';
import UserAvatar from './Common/UserAvatar.jsx';

const RATE_LIMIT_MS = 900;
const MIN_SEARCH_CHARS = 3;

const propTypes = {
  actions: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  unreadCount: PropTypes.number.isRequired,
  app: PropTypes.object.isRequired,
  search: PropTypes.array.isRequired,
};
const styles = {
  autoCompleteStyle: {
    color: 'white',
  },
  listStyle: {
    width: '100%',
    minWidth: 300,
    fontSize: 10,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  textFieldStyle: {
    minWidth: 300,
    width: '100%',
    color: 'white',
  },
  menuStyle: {
    background: '#263238',
    maxWidth: 400,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  menuItemStyle: {
    textOverflow: 'ellipsis',
    minWidth: '100%',
    width: '100%',
    maxWidth: 400,
    color: 'white',
    fontSize: 12,
    marginLeft: -15,
  },
};
/* global gapi window document localStorage */
class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isHangoutBtnRendered: false,
      lastQueryTime: new Date().getTime(),
      lastQueryString: '',
      queryString: '',
    };
    this.newRequest = this.newRequest.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }
  componentDidMount() {
    if (!this.state.isHangoutBtnRendered && $('#hangouts-btn-placeholder').length) {
      const interval = setInterval(function renerHangoutButton() {
        if (gapi && gapi.hangout) {
          clearInterval(interval);
          gapi.hangout.render('hangouts-btn-placeholder', { render: 'createhangout' });
          this.setState({
            isHangoutBtnRendered: true,
          });
        }
      }.bind(this), 1000);
    }
  }

  executeQuery(queryString) {
    if (queryString.trim()) {
      this.props.actions.queryIntegrations(queryString);
      this.setState({
        lastQueryTime: new Date().getTime(),
        lastQueryString: queryString,
      });
    }
  }

  updateQuery(queryString) {
    this.setState({
      queryString,
    });
    if (queryString.length < MIN_SEARCH_CHARS) {
      return;
    }
    const elapsedTime = new Date().getTime() - this.state.lastQueryTime;
    if (elapsedTime < RATE_LIMIT_MS) {
      setTimeout(() => {
        if (this.state.queryString !== this.state.lastQueryString) {
          this.executeQuery(this.state.queryString);
        }
      }, RATE_LIMIT_MS);
    } else {
      this.executeQuery(queryString);
    }
  }

  newRequest() {
    if (this.state.queryString !== this.state.lastQueryString) {
      this.executeQuery(this.state.queryString);
    }
    this.setState({
      queryString: '',
    });
    browserHistory.push('/app/search');
  }

  goToResult(link, e) {
    e.preventDefault();
    window.open(link, '_newtab');
  }

  renderNotifsCount() {
    return (this.props.unreadCount > 0 &&
      <span className="badge">
        {this.props.unreadCount}
      </span>
    );
  }
  render() {
    const image = (
      <UserAvatar
        imgSrc={localStorage.getItem('display_image')}
        displayName={this.props.displayName}
      />
    );
    let searchResults = null;
    if (this.props.search.length === 0 && this.state.queryString.length >= MIN_SEARCH_CHARS) {
      let text = 'Could not find any results';
      if (this.props.app.queriesInProgress) {
        text = 'Searching...';
      }
      searchResults = [{
        text: '',
        value: (
          <MenuItem
            primaryText={
              <span style={styles.menuItemStyle}>
                {text}
              </span>
            }
            disabled
          />
        ),
      }];
    } else {
      searchResults = this.props.search.map(result => {
        let avatar = <Avatar backgroundColor="#263238" size={12} src={result.thumbnail} />;
        if (result.type === 'github') {
          avatar = (
            <Avatar
              backgroundColor="#263238"
              size={12}
              icon={<Code style={{ margin: '0px' }} />}
            />
          );
        }
        return {
          text: result.primaryText,
          value: (
            <MenuItem
              leftIcon={avatar}
              primaryText={
                <span style={styles.menuItemStyle}>
                  {result.primaryText}
                </span>
              }
              onTouchTap={this.goToResult.bind(this, result.link)}
            />
          ),
        };
      });
    }


    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header collab-logo">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand">Collab</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-left header-left">
              <li className="search-box" id="search">
                <AutoComplete
                  hintText={<span style={{ color: 'grey' }}>{ 'Search Collab' }</span>}
                  filter={AutoComplete.noFilter}
                  dataSource={searchResults}
                  onUpdateInput={this.updateQuery}
                  onNewRequest={this.newRequest}
                  searchText={this.state.queryString}
                  listStyle={styles.listStyle}
                  textFieldStyle={styles.textFieldStyle}
                  menuStyle={styles.menuStyle}
                  style={styles.autoCompleteStyle}
                  inputStyle={styles.textFieldStyle}
                  maxSearchResults={6}
                />
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <div id="hangouts-btn-wrapper">
                  <div id="hangouts-btn-placeholder" />
                </div>
              </li>
              <li className="notif-li"><Link to="/app/notifications"><span>Notifs  &nbsp;
                {this.renderNotifsCount}</span></Link></li>
              <li className="display-pic-li">{image}</li>
              <li className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.props.displayName}
                  <span className="caret" />
                </a>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={logout}>Log Out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
Header.propTypes = propTypes;
export default Header;
