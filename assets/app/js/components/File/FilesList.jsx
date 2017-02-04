import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import {Table} from 'react-bootstrap'
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import MoveIcon from 'material-ui/svg-icons/action/input';
import RenameIcon from 'material-ui/svg-icons/editor/mode-edit';
import RemoveRedEyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import CreateNewFolderIcon from 'material-ui/svg-icons/file/create-new-folder';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';
import {CardHeader} from 'material-ui/Card';
import { Form } from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'

import BreadcrumbInstance from './BreadcrumbInstance.jsx'
import {getFileIcon, toFuzzyTime} from '../../utils/general'
import {insertFile, deleteFile, updateFile}  from '../../actions/ReduxTaskActions'
import LoadingIndicator from '../LoadingIndicator.jsx'
import TreeModal from './TreeModal.jsx'




const isFolder = file =>  file.mimeType ==='application/vnd.google-apps.folder'
const isNotTrash = file => !file.trashed

class FilesList extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedFile: null,
      isRenameModalOpen: false,
      canSubmit:false,
      isMoveModalOpen:false,
      movedFile:null
    }
  }

  createFolder() {
    let directoryStructure = this.props.directoryStructure
    let currDirectory = directoryStructure[directoryStructure.length-1].id
    this.props.actions.createFolderToDrive(currDirectory)
  }

  uploadFile(file, e) {
    this.props.dispatch(updateFile(file.id, {uploading: true}))
    let directoryStructure = this.props.directoryStructure
    let currDirectory = directoryStructure[directoryStructure.length-1].id
    this.props.actions.uploadFileToDrive(file, currDirectory, this.props.projectId)
  }
  removeFile(fileId) {
    this.props.actions.removeFileFromDrive(fileId)
  }
  copyFile(fileId) {
    this.props.actions.copyFileToDrive(fileId)
  }
  renameFile(fileId, newName) {
    this.props.actions.renameFileToDrive(fileId, newName)
  }
  moveFile(fileId, oldParents, newParents){
    this.props.actions.moveFileToDrive(fileId, oldParents, newParents)
  }

  navigate(fileId) {
    let selectedFile = this.props.files.filter(file => file.id === fileId)[0]
    if (isFolder(selectedFile)) {
      this.props.actions.initChildrenFiles(this.props.projectId, selectedFile.id, selectedFile.name)
    } else {
      window.open(selectedFile.webViewLink, '_newtab')
    }
  }

  removePreview(id) {
    this.props.dispatch(deleteFile(id))
  }
  onDrop(files) {
    let file = files[0]
    // filter folder
    // as folder type is empty
    if(file.type) {
      this.createFilePreview(file)
    }
  }
  createFilePreview(fileData) {
    let imgSrc = getFileIcon(fileData.type)
    let currDirectoryId = _.last(this.props.directoryStructure).id
    this.props.dispatch(insertFile({
      iconLink: imgSrc,
      id: _.uniqueId(),
      name: fileData.name,
      parents: [currDirectoryId],
      isPreview: true,
      data: fileData
    }))

  }
  computeDirectoryTree(disableFileId) {
    let folders = this.props.files.filter(isFolder).filter(isNotTrash).map(folder=>{
      let data = {
        style: {
          backgroundColor:'white'
        },
        name: folder.name,
        id: folder.id,
        parents: folder.parents,
        toggled: true
      }
      data.disabled = data.id === disableFileId
      return data
    })
    let parentChildrenDict = {}
    // fill data into Parent-Children dictionary
    folders.map(folder=>{
      let parent = folder.parents[0]
      if(parentChildrenDict[parent]) {
        parentChildrenDict[parent].push(folder)
      } else {
        parentChildrenDict[parent] = [folder]
      }
    })

    let root = {
      style: {
        backgroundColor:'white'
      },
      name:'root',
      toggled: true,
      id:this.props.rootFolderId,
      children:[]
    }
    let queue = [root]

    while(queue.length > 0) {
      let current = queue.shift()
      let children = parentChildrenDict[current.id]
      if(children != null) {
        children.forEach(folder=>{queue.push(folder)})
        current.children = children
      } else {
        current.nodes = []
      }
    }
    return root
  }

  handleClose() {
    this.setState({
      isRenameModalOpen: false,
      selectedFile: null,
      canSubmit:false,
    });
  }

  handleRenameModalOpen(file) {
    this.setState({
      isRenameModalOpen: true,
      selectedFile: file,

    });
  }
  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }
  handleMoveModalOpen(file) {
    this.setState({
      isMoveModalOpen:true,
      movedFile:file
    });
  }
  handleMoveModalClose() {
    this.setState({
      isMoveModalOpen:false,
      movedFile:null
    });
  }

  onDialogSubmit() {
    this.renameFile(this.state.selectedFile.id, this.refs.renameField.getValue().trim())
    this.handleClose()
  }
  onFileUploadButtonClick() {
    this.dropzone.open()
  }
  renderMoveModal() {
    return (this.state.isMoveModalOpen &&
      <TreeModal
        handleClose = {this.handleMoveModalClose.bind(this)}
        onDialogSubmit={this.moveFile.bind(this, this.state.movedFile.id, this.state.movedFile.parents)}
        treeNode={this.computeDirectoryTree(this.state.movedFile.id)}
      />
    )
  }
  renderRenameModal() {
    let renameModalActions = [
        <FlatButton
          key={13}
          label="Cancel"
          secondary={true}
          onTouchTap={this.handleClose.bind(this)}
        />,
        <FlatButton
          key={23}
          label="Submit"
          primary={true}
          onTouchTap={this.onDialogSubmit.bind(this)}
          disabled={!this.state.canSubmit}
        />
    ]

    return (this.state.isRenameModalOpen &&
      <Dialog
        autoScrollBodyContent
        actions={renameModalActions}
        onRequestClose={this.handleClose.bind(this)}
        open={this.state.isRenameModalOpen}>
        <Form
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={this.onDialogSubmit.bind(this)}
          >
          <FormsyText
            required
            autoFocus
            value = {this.state.selectedFile.name}
            name="File Name"
            floatingLabelText="New File Name(required)"
            ref="renameField"
            />
        </Form>
      </Dialog>
      )
  }

  renderDropzone(className='') {
    // If user is logged in and already configured root folder
    return (this.props.app.is_linked_to_drive && this.props.rootFolderId &&
      <Dropzone
        ref={(node) => { this.dropzone = node; }}
        onDrop={this.onDrop.bind(this)}
        multiple={false}
        className={"drive-drop-zone "+ className}
      >
        <p>
          Drop a file here, or click to select a file to upload.
        </p>
      </Dropzone>
    )
  }
  renderCreateButton() {
    // If user is logged in and already configured root folder
    return (
      this.props.app.is_linked_to_drive && this.props.rootFolderId && !this.props.app.files.loading &&
      <IconMenu
        iconButtonElement={<RaisedButton label="New" primary={true}/>}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <MenuItem
          primaryText="New Folder"
          leftIcon={<CreateNewFolderIcon />}
          onTouchTap={this.createFolder.bind(this)}
        />
        <MenuItem
          primaryText="Upload File"
          leftIcon={<FileUploadIcon />} onTouchTap={this.onFileUploadButtonClick.bind(this)}
        />
      </IconMenu>
    )
  }
  renderFilePreview(file) {
    let tableData = (
      <td>
        <div className="pull-right">
        <FlatButton
          label="Upload"
          secondary={true}
          onTouchTap={this.uploadFile.bind(this, file)}
          />
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.removePreview.bind(this, file.id)}
          />
        </div>
      </td>
    )
    if (file.uploading) {
      tableData = (
        <td>
          <div className="upload-progress">
            <LinearProgress mode="indeterminate"/>
          </div>
        </td>
      )
    }
    return (
      <tr className="table-row-file" key={file.id}>
        <td>
          <CardHeader
            style={{padding: 5, height:'inherit'}}
            title={file.name}
            avatar={<img style={{width: 15}} src={file.iconLink}/>}
          />
        </td>
        {tableData}
      </tr>
    )
  }
  renderFileStandard(file) {
    let lastModifyingUser = + file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
    let lastModified = 'Modified ' + toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser

    return (
      <tr className="table-row-file" key={file.id}>
        <td onClick={this.navigate.bind(this, file.id)} >
          <CardHeader
            style={{padding: 5, height:'inherit'}}
            title={file.name}
            subtitle={lastModified}
            avatar={<img style={{width: 15}} src={file.iconLink}/>}
          />
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <IconMenu
            className="pull-right"
            iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem
              primaryText="preview"
              leftIcon={<RemoveRedEyeIcon />}
              onTouchTap={this.navigate.bind(this, file.id)}
            />
            <Divider/>
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
            <Divider/>
            <MenuItem
              primaryText="Delete"
              leftIcon={<DeleteIcon />}
              onTouchTap={this.removeFile.bind(this, file.id)}
            />
          </IconMenu>
        </td>
      </tr>
    )
  }
  render() {
    const {files, app, directoryStructure, actions, projectId} = this.props
    const sortByFolderFirst = (fileA, fileB) => {
      if(!isFolder(fileA) && isFolder(fileB)) {
        return 1
      } else {
        return -1;
      }
    }
    // only display files under the current directory
    let filesToDisplay = []
    if (directoryStructure.length > 0) {
      filesToDisplay = this.props.files.filter(file => {
        let curDirectoryId = _.last(directoryStructure).id
        return file.parents && file.parents[0] === curDirectoryId && !file.trashed
      }).sort(sortByFolderFirst)
    }
    let content = <LoadingIndicator className="loading-indicator"/>

    if (!app.files.loading) {
      if (filesToDisplay.length === 0) {
        content = this.renderDropzone()
      } else {
        let tableBody = filesToDisplay.map(file => {
         if (file.isPreview) {
           return this.renderFilePreview(file)
         } else {
           return this.renderFileStandard(file)
         }
       })
       content =
       <div>
         {this.renderDropzone('hidden')}
         <Table hover responsive condensed>
           <thead>
             <tr>
               <th>Name</th>
               <th></th>
             </tr>
           </thead>
           <tbody>
             {tableBody}
           </tbody>
         </Table>
       </div>
      }
    } // not loading


    return (
      <div style={{marginTop: 10}}>
        <div style={{width:"auto", display:'inline-block'}}>
          <BreadcrumbInstance
            key={'breadcrumb_' + projectId}
            directories={directoryStructure}
            changeDirectory={actions.initUpperLevelFolder.bind(this, projectId)}
            />
        </div>
        <div style={{float:'right' }}>
          {this.renderCreateButton()}
        </div>
        {this.renderRenameModal()}
        {this.renderMoveModal()}
        {content}
      </div>
    )
  }
}

FilesList.propTypes = {
  actions: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  directoryStructure: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  rootFolderId: PropTypes.string

};
export default FilesList
