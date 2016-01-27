import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import $ from 'jquery'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Badge, Dropdown, Button } from 'react-bootstrap'
import { IconButton, Dialog, TextField, FlatButton } from 'material-ui'
import {logout} from '../utils/auth.js'

class Header extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            isDialogOpen: false
        }
    }

    handleRequestClose(buttonClicked) {
        if (!buttonClicked && this.state.openDialogStandardActions) return
        this.setState({
            isDialogOpen: false
        })
    }
    onDialogSubmit() {
        let content = this.refs.projectField.getValue().trim()
        if (content !== '') {
            this.props.onCreateProject(content)
        }
        this.setState({
            isDialogOpen: false
        })
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    render() {
        let badge = (<div></div>);
        if (this.props.unreadCount > 0) {
            badge = (<Badge>{this.props.unreadCount}</Badge>);
        }
        let actions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />
        ]

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
                        <NavItem
                            className='nav-link'
                            eventKey={1}
                            onClick={this.openModal.bind(this)}>
                            <span className="header-text">Add Project </span>
                        </NavItem>
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
            <Dialog
                title="Add Project"
                actions={actions}
                open={this.state.isDialogOpen}
                onRequestClose={this.handleRequestClose.bind(this)}>
                <TextField
                    hintText="Project name"
                    onEnterKeyDown={this.onDialogSubmit.bind(this)}
                    ref="projectField"
                />
            </Dialog>
            </div>
            );
    }
}                            

export default Header
