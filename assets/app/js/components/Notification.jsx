
import React, { Component } from 'react'
import NotificationList from './NotificationList.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class NotificationIcon extends Component {
    render() {
        return (
            <div>
                <a href="#" className="notif" onClick={this.props.handleToggle}>
                    <img src="/assets/app/images/notifications.png" className="fa"> </img>
                    <span className="unread-count"><b>{this.props.unreadCount}</b></span>    
                </a>
            </div>
        );
    }
}

class Notification extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            show_list: false
        };
    }

    toggleList() {
        this.setState({
            show_list: !this.state.show_list
        });
    }

    render() {
        let unreadCount = this.props.notifs.reduce((total, notif) => notif.read ? total : total+1, 0);

        return this.state.show_list ? 
        (
            <div>
                <NotificationIcon unreadCount={unreadCount} handleToggle={e => this.toggleList()} />
                    <div className={'notification-container'} key='notification-container'>
                        <h3 className='notif-title'>Notifications</h3>
                        <NotificationList notifs={this.props.notifs} />
                    </div>     
            </div>
  
        ):
        (
            <div>
                <NotificationIcon unreadCount={unreadCount} handleToggle={e => this.toggleList()} />
            </div>
        );
    }
}



export default Notification;