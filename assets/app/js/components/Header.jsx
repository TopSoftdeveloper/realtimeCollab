import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import Modal from 'react-modal'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Badge, Dropdown, Button } from 'react-bootstrap'
import {logout} from '../utils/auth.js'

class Header extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            panel_visible: false,
            modalIsOpen: false,
            inputProject: ''            
        };
    }
    

    /****************************************************************************/
    /*************************  MODAL FOR ADDING PROJECTS  **********************/
    /****************************************************************************/
    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    submit(e) {
        e.preventDefault();
        let content = this.state.inputProject.trim();
        if (content !== '') {
            this.props.onCreateProject(content);
        }
        this.closeModal();
        this.setState({
            inputProject: ''
        });        
    }

    handleProjectChange(e) {
        this.setState({
            inputProject: e.target.value
        });
    }

    render() {
        let badge = (<div></div>);
        if (this.props.unreadCount > 0) {
            badge = (<Badge>{this.props.unreadCount}</Badge>);
        } 

        return (
            <Navbar className='nav-bar'>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/app">Collab</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem
                            className='nav-link'
                            eventKey={2}
                            onClick={this.openModal.bind(this)}>
                            Add Project
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        <LinkContainer to='/app/notifications' >
                            <NavItem
                                className='nav-link'
                                eventKey={2}>
                                Notifs {badge}
                            </NavItem>
                        </LinkContainer>

                        <NavDropdown
                            className='nav-link'
                            eventKey={3}
                            title={this.props.displayName}
                            id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>Account Settings</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.2} onClick={logout}>Log Out</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            );
    }
}                            

export default Header
