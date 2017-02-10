import React, { Component, PropTypes } from 'react'

import NotificationItem from './NotificationItem.jsx';
import {toFuzzyTime} from '../../utils/general'

class NotificationList extends Component {
    render() {
        let notifsSortedByTime = this.props.notifs.sort(function(a, b) {
            return a.time < b.time
        })
        let notificationItems = notifsSortedByTime.map(notif => {
            let matchingUsers = this.props.users.filter(user => user.id === notif.meta.user_id)
            let user = null
            if (matchingUsers.length >= 1) {
                user = matchingUsers[0]
            }

            return <NotificationItem
                id={notif.id}
                key={notif.id}
                text={notif.text}
                type={notif.type}
                meta={notif.meta}
                read={notif.read}
                user={user}
                dispatch={this.props.dispatch}
                fuzzyTime={toFuzzyTime(notif.time)} />

            }
        );

        return (
            <div className='notification-list'>
                <ul>
                    {notificationItems}
                </ul>
            </div>
        );
    }
}
export default NotificationList;
