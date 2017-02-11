import React, { Component, PropTypes } from 'react';
import Steps from 'rc-steps';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

import FilesList from './FilesList.jsx';

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

class FileView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      preview: '',
    };
    this.authorizeDrive = this.authorizeDrive.bind(this);
  }
  setAsRoot(id) {
    this.props.actions.setDirectoryAsRoot(this.props.project.id, id);
  }

  authorizeDrive() {
    // TODO implement this function
  }

  render() {
    const { app, project, actions, files, dispatch } = this.props;
    const filesList = (
      <FilesList
        directoryStructure={project.directory_structure}
        files={files}
        actions={actions}
        projectId={project.id}
        dispatch={dispatch}
        app={app}
        rootFolderId={project.root_folder}
      />
    );

    if (app.is_linked_to_drive && project.root_folder) {
      return (
        <div>{filesList}</div>
      );
    }
    let currentStep = 0;
    const steps = [{ title: 'Authorize Google Drive' }, { title: 'Select root folder' }];
    let currentDirectory = { name: 'Top level directory', id: 'root' };
    if (project.directory_structure && project.directory_structure.length > 0) {
      currentDirectory = _.last(project.directory_structure);
    }
    let stepActionButton = (
      <RaisedButton
        label="Authorize"
        onTouchTap={this.authorizeDrive}
        primary
      />
    );
    if (app.is_linked_to_drive && !project.root_folder) {
      currentStep = 1;
      stepActionButton = (
        <RaisedButton
          className="set-root-dir"
          label="Set current directory as root"
          onTouchTap={this.setAsRoot.bind(this, currentDirectory.id)}
          secondary
        />
      );
    }
    const content = (
      <div>
        {filesList}
        {!app.files.loading && stepActionButton}
      </div>
    );
    return (
      <div className="my-step-container">
        <Steps current={currentStep}>
          {steps.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.title}
            />
          )
          )}
        </Steps>
        {content}
      </div>
    );
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

export default FileView;
