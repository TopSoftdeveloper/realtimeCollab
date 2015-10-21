import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'

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

class TaskPanelHeader extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            modalIsOpen: false,
            inputMilestone: ''
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
        let content = this.state.inputMilestone.trim();
        if (content !== '') {
            this.props.onAddMilestone(content);
        }
        this.closeModal();
        this.setState({
            inputMilestone: ''
        });        
    }

    handleMilestoneChange(e) {
        this.setState({
            inputMilestone: e.target.value
        });
    }

    render() {

        return (
            <div className='task-table-header'>
                <span className='project-name'>{this.props.projectName} </span>
                <a onClick={this.openModal.bind(this)} className='add-milestone-btn btn btn-default'>Add Milestone</a>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)} style={customStyles} >                                    
                    <h3>Add a milestone</h3>
                    <form onSubmit={this.submit.bind(this)}>
                        <input type="text" placeholder="Milestone name" 
                            value={this.state.inputMilestone}
                            onChange={this.handleMilestoneChange.bind(this)}/>                    
                        <button className='btn btn-default'>Add Milestone</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default TaskPanelHeader;