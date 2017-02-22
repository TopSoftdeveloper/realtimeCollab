import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { logout } from '../utils/auth.js';
import UserAvatar from './Common/UserAvatar.jsx';
import SearchBar from './Search/SearchBar.jsx';

const propTypes = {
  actions: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  unreadCount: PropTypes.number.isRequired,
  app: PropTypes.object.isRequired,
  search: PropTypes.array.isRequired,
};

/* global gapi window document localStorage */
class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isHangoutBtnRendered: false,
    };
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

  renderNotifsCount() {
    return (this.props.unreadCount > 0 &&
      <span className="badge">
        {this.props.unreadCount}
      </span>
    );
  }
  render() {
    const { actions, app, search, displayName } = this.props;
    const image = (
      <UserAvatar
        imgSrc={localStorage.getItem('display_image')}
        displayName={this.props.displayName}
      />
    );
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
                <SearchBar
                  actions={actions}
                  app={app}
                  search={search}
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
                {this.renderNotifsCount()}</span></Link></li>
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
                  {displayName}
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
