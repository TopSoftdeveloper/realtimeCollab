import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {SvgIcon} from 'material-ui';

const TrashButton = React.createClass({

    mixins: [PureRenderMixin],

    render() {
        return (
            <SvgIcon {...this.props}>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </SvgIcon>
        );
    }

});

export default TrashButton