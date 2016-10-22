import React, { Component } from 'react';
import {getUserAvatar, toFuzzyTime} from '../../utils/general'
import {Button} from 'react-bootstrap'
var templates = require('../../../../../server/templates.js')

class EventItem extends Component {
    render() {
        let event = this.props.event
        let image = getUserAvatar(event.avatarUrl, event.displayName)

        return (
            <li className="event-item">
                <div className="notif-photo">
                    {image}
                </div>
                <div>
                    <span className='notif-text'>{event.message}</span>
                </div>
                <span className='notif-fuzzy-time'>{toFuzzyTime(event.created_at)}</span>
            </li>
        );
    }
}

function isAllNull(array) {
    let ret = true
    array.forEach(entry => {
        if (entry) ret = false
    })
    return ret
}

class EventList extends Component {
    render() {
        let eventItems = this.props.events.map(event => {
            if (!event.data) return null
            let data = JSON.parse(event.data)
            let targetUser = this.props.users.filter(user => user.id === data.user_id)
            if (targetUser.length === 1) {
                targetUser = targetUser[0]
                data.displayName = targetUser.display_name
            } else {
                return null
            }

            let item = {
                message: templates.getMessage(event.template, data),
                created_at: event.created_at,
                displayName: targetUser.display_name,
                avatarUrl: targetUser.display_image
            }
            return <EventItem
                    key={event.id}
                    event={item}
                 />
            }
        );
        if (eventItems.length === 0 || isAllNull(eventItems)) {
            eventItems = (
                <div className="no-items">
                    <h3>No recent activity!</h3>
                </div>
            )
        }

        return (
            <div className='event-list'>
                <ul>
                    {eventItems}
                </ul>
            </div>
        );
    }
}

export default EventList
