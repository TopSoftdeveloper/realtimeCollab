import Modal from 'react-modal'
import React, { Component } from 'react'
import Add from './../icons/Add.jsx'
import { IconButton } from 'material-ui'

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

    render() {
        return (
            <div key={this.props.milestone.id} className="milestone-row">
                <h3 className="milestone-header">{this.props.milestone}</h3>
                <IconButton
                    className="add-task-btn-outer"
                    onClick={this.openModal.bind(this)}>
                    <Add className="add-task-btn"/>
                </IconButton>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)} style={customStyles} >
                    <h3>Add a task</h3>
                    <form onSubmit={this.submit.bind(this)}>
                        <input type="text" placeholder="Task name"
                            value={this.state.inputMilestone}
                            onChange={this.handleTasknameChange.bind(this)}/>
                        <button className='btn btn-default'>Add Task</button>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default MilestoneRow;