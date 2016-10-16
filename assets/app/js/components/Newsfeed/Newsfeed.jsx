import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
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
Newsfeed.propTypes = {
  // props passed by parents
  project: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,

  // props passed by container
  users: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,


};


export default Newsfeed;
