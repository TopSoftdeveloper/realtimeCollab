import React, { Component, PropTypes } from 'react'
import Steps from 'rc-steps'
require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');
import _ from 'lodash'
import RaisedButton from 'material-ui/lib/raised-button'

import FilesList from './FilesList.jsx'

class FileView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      preview: ''
    }
  }
  setAsRoot(id) {
    this.props.actions.setDirectoryAsRoot(this.props.project.id, id)
  }

  authorizeDrive() {
    // TODO implement this function
    console.log('get drive permission here')
  }

  render() {
    console.log('FileView::render()')
    const {app, project, actions, files, dispatch} = this.props
    let filesList = <FilesList
      directoryStructure={project.directory_structure}
      files={files}
      actions={actions}
      projectId={project.id}
      dispatch={dispatch}
      app={app}
      rootFolderId={project.root_folder}
      />


    if (app.is_linked_to_drive && project.root_folder) {
      return (
        <div>{filesList}</div>
      )
    } else {
      let currentStep = 0
      const steps = [{title: 'Authorize Google Drive'}, {title: 'Select root folder'}]
      let currentDirectory = {name: 'Top level directory', id: 'root'}
      if (project.directory_structure && project.directory_structure.length > 0) {
        currentDirectory = _.last(project.directory_structure)
      }
      let stepActionButton = <RaisedButton label="Authorize"
            onTouchTap={this.authorizeDrive.bind(this)}
            primary={true}
            ></RaisedButton>
      if (app.is_linked_to_drive && !project.root_folder) {
        currentStep = 1
         stepActionButton = <RaisedButton
            className="set-root-dir"
            label="Set current directory as root"
            onTouchTap={this.setAsRoot.bind(this, currentDirectory.id)}
            secondary={true}
            />
      }
      let content = (
          <div>
            {filesList}
            {!app.files.loading && stepActionButton}
          </div>
        )
      return (
        <div className='my-step-container'>
          <Steps current={currentStep}>
            {steps.map(function(s, i) {
              return <Steps.Step
                key={i}
                title={s.title}
              ></Steps.Step>
            })}
          </Steps>
          {content}
        </div>
      )
    }
  }

}

FileView.propTypes = {
  // props passed by parent
  project: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  // props passed by container
  dispatch: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
};

export default FileView
