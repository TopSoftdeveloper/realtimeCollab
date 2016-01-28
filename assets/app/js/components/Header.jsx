import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import { Navbar, Nav, NavItem, Badge } from 'react-bootstrap'
import {logout} from '../utils/auth.js'

class Header extends Component {

    render() {
        let badge = (<div></div>);
        if (this.props.unreadCount > 0) {
            badge = (<Badge>{this.props.unreadCount}</Badge>);
        }

        return (
            <div>
            <Navbar className='nav-bar header-color' fluid={true} fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/app"><span className="header-text">Collab</span></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <LinkContainer to='/app/notifications' >
                            <NavItem
                                className='nav-link'
                                eventKey={2}>
                                <span className="header-text">Notifs </span>{badge}
                            </NavItem>
                        </LinkContainer>
                        <NavItem
                            className='nav-link'
                            eventKey={3}>
                            <span className="header-text">{this.props.displayName} </span>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            </div>
            );
    }
}                            

export default Header
