import React, { Component } from 'react';
import LeftPanel from './LeftPanel.jsx';
import $ from 'jquery';
import Notification from './Notification.jsx';

class Header extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            panel_visible: false
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

    swtich(project_id) {
        this.setState({
            panel_visible: false
        });
        this.props.switchProject(project_id);
        $(document).unbind('click');                      
    }

    render() {
        return (
               <div className='app-header'>
                    <nav>
                        <ul>
                            <li><span onClick={this.showLeft.bind(this)}>Projects</span></li>
                            <li className='app-logo'><a href="#">NUS Collab</a></li>
                            <li className='header-displayName'><a href="#">{this.props.displayName}</a></li>
                            <li className='header-notif'><Notification notifs={this.props.notifs} /></li>
                        </ul>                
                    </nav>
                        <LeftPanel 
                        visibility={this.state.panel_visible} 
                        projects={this.props.projects}
                        switchProject={this.swtich.bind(this)}
                        />
               </div>
            );
    }
}
//                            

export default Header