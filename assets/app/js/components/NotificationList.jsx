import React, { Component } from 'react';


class NotificationItem extends Component {
    render() {

        return (
            <li className='notif-item'>
                <a href={this.props.link}>
                    <span className='notif-text'>{this.props.text}</span>
                    <span className='notif-fuzzy-time'>{this.props.fuzzyTime}</span>
                </a>
            </li>  
        );
    }
}

class NotificationList extends Component {
    toFuzzyTime(time) {
        return '3 minutes ago'
    }

    render() {
        let notificationItems = this.props.notifs.map(notif => 
            <NotificationItem 
                key={notif.id} 
                link={notif.link} 
                text={notif.text} 
                fuzzyTime={this.toFuzzyTime(notif.time)} />
        );

        return this.props.show_list ? 
        (
            <div className='notification-container'>
                <div className='notification-list'>
                    <ul>
                        {notificationItems}             
                    </ul>         
                </div>
            </div>
        ): false;
    }
}

export default NotificationList