import React, { Component } from 'react'
import OnlineUsers from '../components/OnlineUsers.jsx'
import Modal from 'react-modal'
import Add from './../icons/Add.jsx'
import {getCurrentProject} from '../utils/general'
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
}

class ProjectHeader extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            modalIsOpen: false,
            inputMilestone: ''
        }
    }
    /****************************************************************************/
    /*************************     ADDING MILESTONES       **********************/
    /****************************************************************************/

    addMilestone(content) {
        this.props.actions.createMilestone({
            id: _.uniqueId('milestone'),
            content: content,
            deadline: null,
            project_id: getCurrentProject(),
            tasks: []
        })
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    closeModal() {
        this.setState({modalIsOpen: false})
    }

    submit(e) {
        e.preventDefault()
        let content = this.state.inputMilestone.trim()
        if (content !== '') {
            this.addMilestone(content)
        }
        this.closeModal()
        this.setState({
            inputMilestone: ''
        })
    }

    handleMilestoneChange(e) {
        this.setState({
            inputMilestone: e.target.value
        })
    }


    render() {
        return (
            <div className='project-header'>
                <h1 className='project-header-text'>{this.props.projectName} </h1>
                <IconButton onClick={this.openModal.bind(this)} tooltip="Add milestone">
                    <Add className="add-milestone-btn"/>
                </IconButton>

                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)} style={customStyles} >
                    <h3>Add a milestone</h3>
                    <form onSubmit={this.submit.bind(this)}>
                        <input type="text" placeholder="Milestone name"
                               value={this.state.inputMilestone}
                               onChange={this.handleMilestoneChange.bind(this)}/>
                        <button className='btn btn-default'>Add Milestone</button>
                    </form>
                </Modal>
                <OnlineUsers members={this.props.members} />
            </div>
        );
    }
}

export default ProjectHeader