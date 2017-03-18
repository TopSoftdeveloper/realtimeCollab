import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { Table } from 'react-bootstrap';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import MoveIcon from 'material-ui/svg-icons/action/input';
import RenameIcon from 'material-ui/svg-icons/editor/mode-edit';
import RemoveRedEyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import CreateNewFolderIcon from 'material-ui/svg-icons/file/create-new-folder';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import { CardHeader } from 'material-ui/Card';

import BreadcrumbInstance from './BreadcrumbInstance.jsx';
import { getFileIcon, toFuzzyTime } from '../../utils/general';
import { insertFile, deleteFile, updateFile } from '../../actions/ReduxTaskActions';
import LoadingIndicator from '../Common/LoadingIndicator.jsx';
import TreeModal from './TreeModal.jsx';
import RenameModal from './RenameModal.jsx';

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  toolbar: {
    flex: '0 1 auto',
  },
  fileListContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
};
const isFolder = file => file.mimeType === 'application/vnd.google-apps.folder';
const isNotTrash = file => !file.trashed;

class FilesList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isRenameModalOpen: false,
      isMoveModalOpen: false,
      targetFile: null,
    };
    this.createFolder = this.createFolder.bind(this);
    this.handleRenameModalClose = this.handleRenameModalClose.bind(this);
    this.handleMoveModalClose = this.handleMoveModalClose.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleFileUploadButtonClick = this.handleFileUploadButtonClick.bind(this);
  }

  createFolder() {
    const directoryStructure = this.props.directoryStructure;
    const currDirectory = _.last(directoryStructure).id;
    this.props.actions.createFolderToDrive(currDirectory);
  }

  uploadFile(file) {
    this.props.dispatch(updateFile(file.id, { uploading: true }));
    const directoryStructure = this.props.directoryStructure;
    const currDirectory = _.last(directoryStructure).id;
    this.props.actions.uploadFileToDrive(file, currDirectory, this.props.projectId);
  }
  removeFile(fileId) {
    this.props.actions.removeFileFromDrive(fileId);
  }
  copyFile(fileId) {
    this.props.actions.copyFileToDrive(fileId);
  }
  renameFile(fileId, newName) {
    this.props.actions.renameFileToDrive(fileId, newName);
  }

  moveFile(fileId, oldParents, newParents) {
    this.props.actions.moveFileToDrive(fileId, oldParents, newParents);
  }

  navigate(fileId) {
    const selectedFile = this.props.files.filter(file => file.id === fileId)[0];
    if (isFolder(selectedFile)) {
      this.props.actions.initChildrenFiles(this.props.projectId,
        selectedFile.id, selectedFile.name);
    } else {
      /* global window */
      window.open(selectedFile.webViewLink, '_newtab');
    }
  }

  removePreview(id) {
    this.props.dispatch(deleteFile(id));
  }
  onDrop(files) {
    const file = files[0];
    // filter folder
    // as folder type is empty
    if (file.type) {
      this.createFilePreview(file);
    }
  }
  createFilePreview(fileData) {
    const imgSrc = getFileIcon(fileData.type);
    const currDirectoryId = _.last(this.props.directoryStructure).id;
    this.props.dispatch(insertFile({
      iconLink: imgSrc,
      id: _.uniqueId(),
      name: fileData.name,
      parents: [currDirectoryId],
      isPreview: true,
      data: fileData,
    }));
  }
  computeDirectoryTree(disableFileId) {
    const folders = this.props.files.filter(isFolder).filter(isNotTrash).map(folder => {
      const data = {
        style: {
          backgroundColor: 'white',
        },
        name: folder.name,
        id: folder.id,
        parents: folder.parents,
        toggled: true,
      };
      data.disabled = (data.id === disableFileId);
      return data;
    });
    const parentChildrenDict = {};
    // fill data into Parent-Children dictionary
    folders.forEach(folder => {
      const parent = folder.parents[0];
      if (parentChildrenDict[parent]) {
        parentChildrenDict[parent].push(folder);
      } else {
        parentChildrenDict[parent] = [folder];
      }
    });

    const root = {
      style: {
        backgroundColor: 'white',
      },
      name: 'root',
      toggled: true,
      id: this.props.rootFolderId,
      children: [],
    };
    const queue = [root];

    while (queue.length > 0) {
      const current = queue.shift();
      let children = parentChildrenDict[current.id];
      if (children != null) {
        children = children.filter(folder => !folder.disabled);
        children.forEach(folder => { queue.push(folder); });
        current.children = children;
      } else {
        current.nodes = [];
      }
    }
    return root;
  }

  handleRenameModalOpen(file) {
    this.setState({
      isRenameModalOpen: true,
      targetFile: file,
    });
  }
  handleRenameModalClose() {
    this.setState({
      isRenameModalOpen: false,
      targetFile: null,
    });
  }

  handleMoveModalOpen(file) {
    this.setState({
      isMoveModalOpen: true,
      targetFile: file,
    });
  }
  handleMoveModalClose() {
    this.setState({
      isMoveModalOpen: false,
      targetFile: null,
    });
  }
  handleFileUploadButtonClick() {
    this.dropzone.open();
  }
  renderMoveModal() {
    return (this.state.isMoveModalOpen &&
      <TreeModal
        handleClose={this.handleMoveModalClose}
        onDialogSubmit={this.moveFile.bind(this, this.state.targetFile.id,
          this.state.targetFile.parents)}
        treeNode={this.computeDirectoryTree(this.state.targetFile.id)}
      />
    );
  }
  renderRenameModal() {
    return (this.state.isRenameModalOpen &&
      <RenameModal
        handleClose={this.handleRenameModalClose}
        onDialogSubmit={this.renameFile.bind(this, this.state.targetFile.id)}
        inputValue={this.state.targetFile.name}
      />
    );
  }

  renderDropzone(className = '') {
    // If user is logged in and already configured root folder
    return (this.props.app.is_linked_to_drive && this.props.rootFolderId &&
      <Dropzone
        ref={(node) => { this.dropzone = node; }}
        onDrop={this.onDrop}
        multiple={false}
        className={`drive-drop-zone ${className}`}
      >
        <p>
          Drop a file here, or click to select a file to upload.
        </p>
      </Dropzone>
    );
  }
  renderCreateButton() {
    // If user is logged in and already configured root folder
    return (this.props.app.is_linked_to_drive && this.props.rootFolderId &&
      !this.props.app.files.loading &&
      <IconMenu
        className="drive-create-button"
        iconButtonElement={<RaisedButton label="New" primary />}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem
          primaryText="New Folder"
          leftIcon={<CreateNewFolderIcon />}
          onTouchTap={this.createFolder}
        />
        <MenuItem
          primaryText="Upload File"
          leftIcon={<FileUploadIcon />}
          onTouchTap={this.handleFileUploadButtonClick}
        />
      </IconMenu>
    );
  }
  renderFilePreview(file) {
    let tableData = (
      <td>
        <div className="pull-right">
          <FlatButton
            label="Upload"
            secondary
            onTouchTap={this.uploadFile.bind(this, file)}
          />
          <FlatButton
            label="Cancel"
            primary
            onTouchTap={this.removePreview.bind(this, file.id)}
          />
        </div>
      </td>
    );
    if (file.uploading) {
      tableData = (
        <td>
          <div className="upload-progress">
            <LinearProgress mode="indeterminate" />
          </div>
        </td>
      );
    }
    return (
      <tr className="table-row-file" key={file.id}>
        <td>
          <CardHeader
            style={{ padding: 5, height: 'inherit' }}
            title={file.name}
            avatar={<img alt={'preview'} style={{ width: 15 }} src={file.iconLink} />}
          />
        </td>
        {tableData}
      </tr>
    );
  }
  renderFileStandard(file) {
    const lastModifyingUser = file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName;
    const lastModified = `Modified ${toFuzzyTime(file.modifiedTime)} by ${lastModifyingUser}`;

    return (
      <tr className="table-row-file" key={file.id}>
        <td onClick={this.navigate.bind(this, file.id)}>
          <CardHeader
            style={{ padding: 5, height: 'inherit' }}
            title={file.name}
            subtitle={lastModified}
            avatar={<img alt={'file'} style={{ width: 15 }} src={file.iconLink} />}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>
          <IconMenu
            className="pull-right"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            <MenuItem
              primaryText="preview"
              leftIcon={<RemoveRedEyeIcon />}
              onTouchTap={this.navigate.bind(this, file.id)}
            />
            <Divider />
            {
              !isFolder(file) &&
              <MenuItem
                primaryText="make a copy"
                leftIcon={<ContentCopyIcon />}
                onTouchTap={this.copyFile.bind(this, file.id)}
              />
            }
            <MenuItem
              primaryText="Rename"
              leftIcon={<RenameIcon />}
              onTouchTap={this.handleRenameModalOpen.bind(this, file)}
            />
            <MenuItem
              primaryText="Move"
              leftIcon={<MoveIcon />}
              onTouchTap={this.handleMoveModalOpen.bind(this, file)}
            />
            <Divider />
            <MenuItem
              primaryText="Delete"
              leftIcon={<DeleteIcon />}
              onTouchTap={this.removeFile.bind(this, file.id)}
            />
          </IconMenu>
        </td>
      </tr>
    );
  }
  render() {
    const { files, app, directoryStructure, actions, projectId } = this.props;
    const sortByPreviewFirstThenByFolder = (fileA, fileB) => {
      if (fileA.isPreview) {
        return -1;
      }
      if (fileB.isPreview) {
        return 1;
      }
      if (!isFolder(fileA) && isFolder(fileB)) {
        return 1;
      }
      return -1;
    };
    // only display files under the current directory
    let filesToDisplay = [];
    if (directoryStructure.length > 0) {
      filesToDisplay = files.filter(file => {
        const curDirectoryId = _.last(directoryStructure).id;
        return file.parents && file.parents[0] === curDirectoryId && !file.trashed;
      }).sort(sortByPreviewFirstThenByFolder);
    }
    let content = <LoadingIndicator className="loading-indicator" />;

    if (!app.files.loading) {
      if (filesToDisplay.length === 0) {
        content = this.renderDropzone();
      } else {
        const tableBody = filesToDisplay.map(file => {
          if (file.isPreview) {
            return this.renderFilePreview(file);
          }
          return this.renderFileStandard(file);
        });
        content = (
          <div>
            <Table hover responsive condensed>
              <thead>
                <tr>
                  <th>Name</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </Table>
            {this.renderDropzone('hidden')}
          </div>
        );
      }
    } // not loading


    return (
      <div style={styles.container} >
        <div style={styles.toolbar}>
          <div style={{ width: 'auto', display: 'inline-block' }}>
            <BreadcrumbInstance
              key={`breadcrumb_${projectId}`}
              directories={directoryStructure}
              changeDirectory={actions.initUpperLevelFolder.bind(this, projectId)}
            />
          </div>
          <div style={{ float: 'right' }}>
            {this.renderCreateButton()}
          </div>
        </div>
        <div style={styles.fileListContainer}>
          {content}
        </div>
        {this.renderRenameModal()}
        {this.renderMoveModal()}
      </div>
    );
  }
}

FilesList.propTypes = {
  actions: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  directoryStructure: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  rootFolderId: PropTypes.string,

};
export default FilesList;
