import React, { Component } from 'react';
import vagueTime from 'vague-time'
import {getUserAvatar} from '../../utils/general'
import {Button} from 'react-bootstrap'

class EventItem extends Component {
    toFuzzyTime(time) {
        // Display exact date if older than 1 day
        let eventTime = new Date(time)
        let MS_IN_A_DAY = 24*60*60*1000
        if (new Date().getTime() -  eventTime.getTime() > MS_IN_A_DAY) {
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            return eventTime.toLocaleDateString('en-US', options)
        }
        return vagueTime.get({
            to: eventTime.getTime()/1000, // convert ISO UTC to seconds from epoch
            units: 's'
        })
    }

    render() {
        let image = null
        let event = this.props.event
        if (event.actor) {
            image = getUserAvatar(event.actor.avatar_url, event.actor.login)
        }

        return (
            <li className="github-event-item">
                <div className="notif-photo">
                    {image}
                </div>
                <div>
                    <span className='notif-text'>{event.message}</span>
                </div>
                <span className='notif-fuzzy-time'>{this.toFuzzyTime(event.created_at)}</span>
            </li>
        );
    }
}

class EventList extends Component {
    render() {
        let eventItems = this.props.events.map(event => {
            return <EventItem
                    key={event.id}
                    event={event}
                 />
            }
        );

        return (
            <div className='github-event-list'>
                <ul>
                    {eventItems}
                </ul>
            </div>
        );
    }
}

export default EventList