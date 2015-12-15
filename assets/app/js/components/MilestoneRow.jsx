import Modal from 'react-modal'
import React, { Component } from 'react'
import MoreVert from './../icons/MoreVert.jsx'
import { IconButton, IconMenu } from 'material-ui'
const MenuItem = require('material-ui/lib/menus/menu-item');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class MilestoneRow extends Component {

    constructor(props, context) {
        super(props, context); 
        this.state = {
            modalIsOpen: false,
            inputTaskname: ''
        }
    }    

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    submit(e) {
        e.preventDefault();
        let content = this.state.inputTaskname.trim();
        if (content !== '') {
            this.props.onAddTask(content);
        }
        this.closeModal();
        this.setState({
            inputTaskname: ''
        });
    }

    handleTasknameChange(e) {
        this.setState({
            inputTaskname: e.target.value
        });
    }

    deleteMilestone() {
        this.props.onDeleteMilestone()
    }

    render() {
        let iconButtonElement = <IconButton><MoreVert /></IconButton>

        return (
            <div className="milestone-row">
                <h3 className="milestone-header">{this.props.milestone}</h3>
                <IconMenu
                    className="more-vert-btn"
                    iconButtonElement={iconButtonElement}
                    openDirection="bottom-right">
                    <MenuItem primaryText="Add Task" onClick={this.openModal.bind(this)}/>
                    <MenuItem primaryText="Delete Milestone" onClick={this.deleteMilestone.bind(this)}/>
                </IconMenu>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)} style={customStyles} >
                    <h3>Add a task</h3>
                    <form onSubmit={this.submit.bind(this)}>
                        <input type="text" placeholder="Task name"
                            value={this.state.inputMilestone}
                            onChange={this.handleTasknameChange.bind(this)}/>
                        <button className='btn btn-default'>Add Task</button>
                    </form>
                </Modal>
                <div className="clearfix"></div>
            </div>
        )
    }
}

export default MilestoneRow