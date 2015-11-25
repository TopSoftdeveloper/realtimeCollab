import React, { Component, PropTypes } from 'react'
import ReactTabs from 'react-tabs'
import _ from 'lodash'
import $ from 'jquery'
import TaskPanelHeader from './TaskPanelHeader.jsx'
import MilestoneRow from './MilestoneRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import MilestoneView from './MilestoneView.jsx'
import Settings from './Settings.jsx'

const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;

class TaskPanel extends Component {
    constructor(props, context) {
        super(props, context); 
    }

    handleSelect(index, last) {
    }

    render() {   

        return (
            <div className='task-table'>
                <TaskPanelHeader projectName={this.props.projectName}/>
                <Tabs onSelect={this.handleSelect.bind(this)}>
                    
                    <TabList>
                        <Tab>Milestone View</Tab>
                        <Tab>Settings</Tab>
                    </TabList>

                    <TabPanel>
                        <MilestoneView 
                            milestones={this.props.milestones}
                            tasks={this.props.tasks}  
                            actions={this.props.actions}
                            projectId={this.props.projectId}
                        />   
                    </TabPanel>

                    <TabPanel>
                        <Settings projectName={this.props.projectName}/>
                    </TabPanel>
                    
                </Tabs>                        
            </div>
        );
    }
}

export default TaskPanel;