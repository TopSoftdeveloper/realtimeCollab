import React, { Component } from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';

class LoadingIndicator extends Component {
    render() {
        return (
        <div className="loading-indicator">
            <CircularProgress size={0.7}/>
        </div>);
    }
}

export default LoadingIndicator