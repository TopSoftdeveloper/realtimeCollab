import React, { Component, PropTypes } from 'react'
import { Panel, ListGroup, ListGroupItem, ButtonInput, Input } from 'react-bootstrap'

const addMember = (
    <ButtonInput type="submit" value="Add member"/>
);

const rename = (
    <ButtonInput type="submit" value="Rename"/>
);


class Settings extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    render() {   
        let listGroups = [];
        listGroups.push(
            <ListGroupItem key={this.props.projectCreator.id}>
                {this.props.projectCreator.display_name} (creator)
            </ListGroupItem>);
        this.props.basicUsers.forEach(user => listGroups.push(
            <ListGroupItem key={user.id}>
                {user.display_name}
            </ListGroupItem>
        ));

        this.props.pendingUsers.forEach(user => listGroups.push(
            <ListGroupItem key={user.id}>
                {user.display_name} (pending)
            </ListGroupItem>
        ));

        return (
            <div className='settings'>
                <ListGroup>
                    <ListGroupItem bsStyle="info">Members</ListGroupItem>
                        {listGroups}
                    <ListGroupItem>
                        <form>
                            <Input type="email" label="Search by email" buttonAfter={addMember}/>
                        </form>
                    </ListGroupItem>
                </ListGroup>

                <Panel header='Options'>
                    <form>
                        <Input 
                            type="text" 
                            label="Project name" 
                            defaultValue={this.props.projectName} 
                            buttonAfter={rename}
                        />
                    </form>                
                </Panel>                
            </div>
        );
    }
}

export default Settings;