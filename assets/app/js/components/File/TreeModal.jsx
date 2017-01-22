import React, { Component } from 'react';
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog';
import Paper from 'material-ui/lib/paper';

import { Form } from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {Treebeard} from 'react-treebeard'

import theme from '../../myTheme.js'

const TreebeardStyle = { // template from Treebeard src/themes/defaults.js https://github.com/alexcurtis/react-treebeard/blob/master/src/themes/default.js
  tree: {
    base: {
      listStyle: 'none',
      backgroundColor: 'white', // default '#21252B'
      margin: 0,
      padding: 0,
      color: 'black', // default #9DA5AB
      fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
      fontSize: '14px'
    },
    node: {
      base: {
        position: 'relative'
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block'
      },
      activeLink: {
        background: theme.palette.primary1Color,//default '#31363F'
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-5px',
          height: '24px',
          width: '24px'
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-7px 0 0 -7px',
          height: '14px'
        },
        height: 14,
        width: 14,
        arrow: {
          fill: 'black', // default '#9DA5AB'
          strokeWidth: 0
        }
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          color: 'black', // default '#9DA5AB'

        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px'
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle'
        }
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
      loading: {
        color: '#E2C089'
      }
    }
  }
}
class TreeModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cursor: null,
      canSubmit: false
    }
    this.onToggle = this.onToggle.bind(this)
    this.onDialogSubmit = this.onDialogSubmit.bind(this)
    this.disableSubmitButton = this.disableSubmitButton.bind(this)
    this.enableSubmitButton = this.enableSubmitButton.bind(this)
  }

  enableSubmitButton() {
    this.setState({
      canSubmit: true
    });
  }
  disableSubmitButton() {
    this.setState({
      canSubmit: false,
    });
  }
  onDialogSubmit() {
    this.props.onDialogSubmit([this.state.cursor.id])
    this.props.handleClose()
  }

  onToggle(node, toggled){
    if(this.state.cursor){
      this.state.cursor.active = false;
    }
    node.active = true;
    this.setState({ cursor: node });
  }
  render(){
    const {
      handleClose,
      treeNode,
    } = this.props
    const actionButtons = [
      <FlatButton
        key={1}
        label="Cancel"
        secondary={true}
        onTouchTap={handleClose} />,
      <FlatButton
        key={2}
        label="Submit"
        primary={true}
        onTouchTap={this.onDialogSubmit}
        disabled={!this.state.canSubmit} />
    ]
    return(
      <Dialog
        autoScrollBodyContent
        title={"Select destination folder"}
        actions={actionButtons}
        onRequestClose={handleClose}
        open={true}>
        <Form
          onValid={this.enableSubmitButton}
          onInvalid={this.disableSubmitButton}
          onValidSubmit={this.onDialogSubmit}
          >
          <Paper zDepth={0}>
            <Treebeard
              data={treeNode}
              onToggle={this.onToggle}
              style={TreebeardStyle}
              />
          </Paper>
          <FormsyText
            className = 'invisible'
            required
            value={this.state.cursor?this.state.cursor.id:''}
            name="hiddenInputPlaceHolder"
            />
        </Form>
      </Dialog>
    )
  }
}

export default TreeModal
