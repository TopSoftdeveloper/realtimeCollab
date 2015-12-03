import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import LeftPanel from './LeftPanel.jsx'
import $ from 'jquery'
import Modal from 'react-modal'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Badge, Dropdown, Button } from 'react-bootstrap'
import {logout} from '../utils/auth.js'

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};


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
    /*****************************  LEFT PANEL   ********************************/
    /****************************************************************************/
    hideLeft(event) {
        if (!$(event.target).closest('.menu').length) {
            $(document).unbind('click');                      
            this.setState({
                panel_visible: false
            }); 
        }
    }

    showLeft() {
        this.setState({
            panel_visible: true
        });
        $(document).bind('click', this.hideLeft.bind(this));    
    }

    switch(project_id) {
        this.setState({
            panel_visible: false
        });
        this.props.switchProject(project_id);
        $(document).unbind('click');                      
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
            <div className='app-header'>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/app">Collab</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={1} onClick={this.showLeft.bind(this)}>Show Projects</NavItem>
                            <NavItem eventKey={2} onClick={this.openModal.bind(this)}>Add Project</NavItem>
                        </Nav>
                        <Nav pullRight>
                            <LinkContainer to='/app/notifications' >
                                <NavItem eventKey={2}>
                                    Notifs {badge}
                                </NavItem>
                            </LinkContainer>

                            <NavDropdown eventKey={3} title={this.props.displayName} id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1}>Account Settings</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.2} onClick={logout}>Log Out</MenuItem>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)} style={customStyles} >                                    
                    <h3>Add a project</h3>
                    <form onSubmit={this.submit.bind(this)}>
                        <input type="text" placeholder="Project name" 
                            value={this.state.inputProject}
                            onChange={this.handleProjectChange.bind(this)}/>                    
                        <button className='btn btn-default'>Create Project</button>
                    </form>
                </Modal>
                <LeftPanel 
                visibility={this.state.panel_visible} 
                projects={this.props.projects}
                switchProject={this.switch.bind(this)}
                />                
            </div>    
            );
    }
}                            

export default Header                                