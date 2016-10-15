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
    dispatch: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    events: state.newsfeed.filter(event => event.project_id === ownProps.project.id)
  }
}


export default connect(mapStateToProps)(Newsfeed)
