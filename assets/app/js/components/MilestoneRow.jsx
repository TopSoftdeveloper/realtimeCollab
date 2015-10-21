import Modal from 'react-modal'
import React, { Component } from 'react'

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
            <div className="milestone-row">
                <span className="milestone-name">{this.props.milestone}</span>
                <i className="fa fa-plus-square-o" onClick={this.openModal.bind(this)}></i>
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
            );
    }
}

export default MilestoneRow;