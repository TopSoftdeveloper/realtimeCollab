import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Steps from 'rc-steps';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import { Alert } from 'react-bootstrap';
import FilesList from './FilesList.jsx';

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

const styles = {
  container: {
    paddingBottom: 0,
    marginTop: 10,
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  stepsContainer: {
    flex: '0 1 auto',
    padding: 10,
  },
  filesListContainer: {
    marginTop: 10,
    flex: '1 1 auto',
    padding: 10,
    overflowY: 'auto',
  },
  stepButtonContainer: {
    marginTop: 10,
    flex: '0 1 auto',
    padding: 0,
  },
  steps: {
    textWrap: 'nowrap',
    width: '100%',
  },
  standAloneContainer: {
    marginTop: 10,
    padding: 10,
    height: '100%',
  },
};

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
    if (project.folder_error) {
      return (
        <Paper rounded={false} style={{ marginTop: 10 }}>
          <Alert bsStyle="danger">
            <h4>Oh, error occurs when trying to connect to the drive!</h4>
            <p>Please make sure root folder exists and access privilege has been granted.</p>
          </Alert>
        </Paper>
      );
    }
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
        <Paper style={styles.standAloneContainer}>
          {filesList}
        </Paper>
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
        className="animated infinite pulse"
      />
    );
    if (app.is_linked_to_drive && !project.root_folder) {
      currentStep = 1;
      stepActionButton = (
        <RaisedButton
          className="animated infinite pulse"
          label="Set current directory as root"
          onTouchTap={this.setAsRoot.bind(this, currentDirectory.id)}
          secondary
        />
      );
    }
    return (
      <div style={styles.container}>
        <Paper style={styles.stepsContainer}>
          <Steps style={styles.steps} current={currentStep}>
            {steps.map((step, index) => (
              <Steps.Step
                style={{ position: 'relative' }}
                key={index}
                title={step.title}
              />
            )
            )}
          </Steps>
        </Paper>
        <Paper style={styles.filesListContainer}>
          {filesList}
        </Paper>
        <div style={styles.stepButtonContainer} >
          {!app.files.loading && stepActionButton}
        </div>
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
