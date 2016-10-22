import React, { Component } from 'react';
import { browserHistory } from 'react-router'

import {ListGroupItem, ListGroup} from 'react-bootstrap'

import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog';

import { Form } from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'


class TreeNode extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const {
      onClick,
      isSelected,
      text,
      children,
      disabled
    } = this.props

    return (
      disabled ? null :
      <ListGroupItem className='borderless' disabled={disabled}
         bsStyle={isSelected?'info':null}>
        <p onClick={onClick}>{text}</p>
        {children}
      </ListGroupItem>
    )
  }
}


class Tree extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: null
    }
  }
  onNodeClick(node) {
    this.props.onNodeClick(node)
    this.setState({
      selected: node
    })
  }

  render() {
    const renderTreeNode = (treeNode) => {
      if(treeNode.children != null){
        let subTree = []
        treeNode.children.forEach(childNode=>{subTree.push(renderTreeNode(childNode))})
        return (
        <TreeNode  disabled={treeNode.disabled} key={treeNode.id} text={treeNode.text} isSelected={this.state.selected && treeNode.id===this.state.selected.id} onClick={this.onNodeClick.bind(this, treeNode)}>
          <ListGroup>
            {subTree}
          </ListGroup>
        </TreeNode>)
      } else {
        return <TreeNode disabled={treeNode.disabled} key={treeNode.id} text={treeNode.text} isSelected={this.state.selected && treeNode.id===this.state.selected.id} onClick={this.onNodeClick.bind(this, treeNode)}/>
      }
    }
    return (renderTreeNode(this.props.treeNode))
  }
}

class TreeModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedNode: null,
      canSubmit: false
    }
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
    this.props.onDialogSubmit([this.state.selectedNode.id])
    this.props.handleClose()
  }

  onNodeClick(node) {
    this.setState({
      selectedNode: node,
    })
  }

  render(){
    const {
      handleClose,
      treeNode,
    } = this.props
    const actions = [
        <FlatButton
            key={1}
            label="Cancel"
            secondary={true}
            onTouchTap={handleClose} />,
        <FlatButton
            key={2}
            label="Submit"
            primary={true}
            onTouchTap={this.onDialogSubmit.bind(this)}
            disabled={!this.state.canSubmit} />
    ]
    return(
      <Dialog
      autoScrollBodyContent = {true}
      className= 'overflow-y'
      title={"Select destination folder"}
      actions={actions}
      onRequestClose={handleClose}
      open={true}>
      <Form
        onValid={this.enableSubmitButton.bind(this)}
        onInvalid={this.disableSubmitButton.bind(this)}
        onValidSubmit={this.onDialogSubmit.bind(this)}
        >

        <Tree onNodeClick={this.onNodeClick.bind(this)} treeNode={treeNode}/>
        <FormsyText
          className = 'invisible'
          required
          value={this.state.selectedNode?this.state.selectedNode.id:''}
          name="hiddenInputPlaceHolder"
          ref="newParentField"
          />
      </Form>
    </Dialog>
    )
  }
}

export default TreeModal
