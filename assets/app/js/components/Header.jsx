import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import $ from 'jquery';
import { logout } from '../utils/auth.js';
import SearchBar from './Search/SearchBar.jsx';

const propTypes = {
  actions: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  app: PropTypes.object.isRequired,
  search: PropTypes.array.isRequired,
};
const styles = {
  appBar: {
    position: 'absolute',
    left: 0,
    minWidth: 600,
    overflowX: 'auto',
  },
  rightIcon: {
    verticalAlign: 'middle',
    marginTop: 0,
  },
  nameContainer: {
    fontSize: 15,
    color: 'white',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
    paddingLeft: 10,
    paddingRight: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  titileContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
  },
  titleTextContainer: {
    flex: '0 1 auto',
    minWidth: 200,
  },
  searchBarContainer: {
    flex: '1 1 auto',
    textAlign: 'right',
  },
  hangoutContainer: {
    flex: '0 1 auto',
    zIndex: 0,
  },
  hangoutIcon: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 10,
    paddingLeft: 10,
  },

};
/* global gapi window document localStorage */
class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSearchBar: true,
      isHangoutBtnRendered: false,
    };
    this.toggleSearchBar = this.toggleSearchBar.bind(this);
  }
  componentDidMount() {
    // render hangout button
    // To maintain a consistent style on app bar,
    // make google-generated button overlaped with system button and
    // set the google button's opacity as 0
    if (!this.state.isHangoutBtnRendered && $('#hangouts-btn-placeholder').length) {
      const interval = setInterval(function renerHangoutButton() {
        if (gapi && gapi.hangout) {
          clearInterval(interval);
          gapi.hangout.render('hangouts-btn-placeholder',
          { render: 'createhangout', widget_size: 24 });
          $('#hangouts-btn-placeholder').css({
            opacity: 0,
            position: 'absolute',
            right: 150,
            top: 16,
            zIndex: 0,
          });

          this.setState({
            isHangoutBtnRendered: true,
          });
        }
      }.bind(this), 1000);
    }
  }
  toggleSearchBar() {
    this.setState({
      showSearchBar: !this.state.showSearchBar,
    });
  }
  renderSearchBar() {
    return (
      <span style={styles.searchBarContainer}>
        <IconButton
          iconStyle={{ color: 'white' }}
          iconClassName="material-icons" onTouchTap={this.toggleSearchBar}
        >
          search
        </IconButton>
        {this.state.showSearchBar &&
          <SearchBar
            actions={this.props.actions}
            app={this.props.app}
            search={this.props.search}
          />
        }
      </span>
    );
  }
  render() {
    const { displayName } = this.props;
    return (
      <AppBar
        showMenuIconButton={false}
        style={styles.appBar}
        iconStyleRight={styles.rightIcon}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <span style={styles.nameContainer}>
                {displayName}
                <i style={{ verticalAlign: 'middle' }} className="material-icons">
                  keyboard_arrow_down
                </i>
              </span>

            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              leftIcon={<Avatar src={localStorage.getItem('display_image')} />
              }
              onClick={logout} primaryText="Sign out"
            />
          </IconMenu>
        }
        title={
          <div style={styles.titileContainer}>
            <span style={styles.titleTextContainer}>NUSCollab</span>
            {this.renderSearchBar()}
            <span style={styles.videoContainer}>
              <span style={styles.hangoutContainer}>
                <i style={styles.hangoutIcon} className="material-icons">video_call</i>
              </span>
              <div id="hangouts-btn-placeholder" />
            </span>
          </div>
        }
      />
    );
  }
}
Header.propTypes = propTypes;
export default Header;
