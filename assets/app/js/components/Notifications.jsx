import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import vagueTime from 'vague-time'

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
        return vagueTime.get({
            from: time,
            to: 0,
            units: 's'
        })
    }

    render() {
        let notificationItems = this.props.notifs.map(notif => 
            <NotificationItem 
                key={notif.id} 
                link={notif.link} 
                text={notif.text} 
                fuzzyTime={this.toFuzzyTime(notif.time)} />
        );

        return (
            <div className='notification-container'>
                <div className='notification-list'>
                    <ul>
                        {notificationItems}             
                    </ul>         
                </div>
            </div>
        );
    }
}

class Notifications extends Component {    
    render() {
        const {notifications} = this.props;
        return (
            <div>
                <h3>All Notifications</h3>  
                <NotificationList notifs={notifications} />         
            </div>            
        );
    }
}

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}


export default connect(mapStateToProps)(Notifications)