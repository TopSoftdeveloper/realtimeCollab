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

        return (
            <div className='settings'>
                <ListGroup>
                    <ListGroupItem bsStyle="info">Members</ListGroupItem>
                    <ListGroupItem href="#link1">Yan Yi</ListGroupItem>
                    <ListGroupItem href="#link2">Cristina</ListGroupItem>
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