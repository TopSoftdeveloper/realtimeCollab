import React, { Component } from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';

class LoadingIndicator extends Component {
    render() {
        let size = 0.6
        if (this.props.size) size = this.props.size
        return (
        <div className="loading-indicator">
            <CircularProgress size={size}/>
        </div>);
    }
}

export default LoadingIndicator