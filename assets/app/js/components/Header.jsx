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


    render() {
        let notifs = [{
            text: 'Cristina invited you to the project CS3201',
            fuzzyTime: '2 minutes ago',
            id: 'notif-1'
        }];
        return (
               <div className='app-header'>
                    <nav>
                        <ul>
                            <li><span onClick={e => this.showLeft()}>Projects</span></li>
                            <li className='app-logo'><a href="#">NUS Collab</a></li>
                            <li className='header-displayName'><a href="#">{this.props.displayName}</a></li>
                            <li className='header-notif'><Notification notifs={notifs} /></li>
                            <li><a href="#"> Log Out </a></li>
                        </ul>                
                    </nav>
                        <LeftPanel visibility={this.state.panel_visible} showLeft={e => this.showLeft()} 
                            hideLeft={e => this.hideLeft()} projects={this.props.projects}/>
               </div>
            );
    }
}

export default Header