/**
* Wrapper module for History as ES6 has no mixins
**/
import React from 'react'
import { History } from 'react-router'

export function connectHistory(Component) {
	return React.createClass({
    	mixins: [ History ],
	    render() {
	      	return <Component {...this.props} history={this.history} />
	    }
  })
}