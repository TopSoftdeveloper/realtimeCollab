import React, { Component, PropTypes } from 'react'
import EventList from './EventList.jsx'
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Newsfeed extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
    render() {
      console.log('Newsfeed::render()')
      const {events, project} = this.props
      // let eventsInProject = events.filter(event => event.project_id === project.id)
        return (
            <div>
                <br/>
                <EventList
                    events={events}
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
