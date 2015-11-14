import React, { Component } from 'react';
import LeftPanel from './LeftPanel.jsx';
import $ from 'jquery';
import Notification from './Notification.jsx';
import Modal from 'react-modal'

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

    logOut() {
        console.log('logged out');
    }

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
        return (
               <div className='app-header'>
                    <nav>
                        <ul>
                            <li className='app-logo'><a href="#">NUSCollab</a></li>      
                            <li><i onClick={this.showLeft.bind(this)} className="fa fa-bars"></i></li>
                            <li><i onClick={this.openModal.bind(this)} className="fa fa-plus-circle"></i></li>
                            <li className='header-notif'><Notification notifs={this.props.notifs} /></li>
                            <li className='header-displayName'><a href="#">{this.props.displayName}</a></li>                                                    
                        </ul>                
                    </nav>

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
//                            

export default Header