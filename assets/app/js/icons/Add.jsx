import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {SvgIcon} from 'material-ui';

const Add = React.createClass({

    mixins: [PureRenderMixin],

    render() {
        return (
            <SvgIcon {...this.props}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </SvgIcon>
        );
    }

});

export default Add