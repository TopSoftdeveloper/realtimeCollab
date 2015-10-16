import React, { Component } from 'react';
import Sticky from 'react-sticky'
import LeftPanel from '../components/LeftPanel.jsx';
import $ from 'jquery';

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

    hideLeftEventHandler(event) {
        if (!$(event.target).closest('.menu').length) {
            this.hideLeft();
        }
    }

    showLeft(event) {
        this.setState({
            panel_visible: true
        });
        $(document).on('click', this.hideLeftEventHandler.bind(this));              
    }

    hideLeft() {
        $(document).off('click');                      
        this.setState({
            panel_visible: false
        });        
    }

    render() {
       return (
               <Sticky>
                    <header className='app-header'>
                      <LeftPanel visibility={this.state.panel_visible} showLeft={e => this.showLeft()} 
                        hideLeft={e => this.hideLeft()} />
                      <button onClick={e => this.showLeft()}>Show Left Menu!</button>
                      <button className='btn btn-default logout' onClick={e => this.logOut()}>Log Out</button>
                      <h1>NUS Collab </h1>
                    </header>
               </Sticky>
           );
    }
}

export default Header