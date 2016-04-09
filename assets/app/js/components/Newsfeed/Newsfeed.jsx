import React, { Component, PropTypes } from 'react'
import EventList from './EventList.jsx'

class Newsfeed extends Component {
    render() {
        return (
            <div>
                <br/>
                <EventList
                    events={this.props.events}
                    users={this.props.users}
                />
            </div>
        )
    }
}

export default Newsfeed