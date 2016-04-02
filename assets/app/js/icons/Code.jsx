import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {SvgIcon} from 'material-ui';

const Code = React.createClass({

    mixins: [PureRenderMixin],

    render() {
        return (
            <SvgIcon {...this.props} style={this.props.style}>
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </SvgIcon>
        );
    }

});

export default Code