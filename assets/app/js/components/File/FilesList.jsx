import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import {Table} from 'react-bootstrap'

import LinearProgress from 'material-ui/lib/linear-progress'
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button'
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/lib/flat-button'
import Divider from 'material-ui/lib/divider';
import ContentCopy from 'material-ui/lib/svg-icons/content/content-copy';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Move from 'material-ui/lib/svg-icons/action/input';
import Rename from 'material-ui/lib/svg-icons/editor/mode-edit';
import RemoveRedEye from 'material-ui/lib/svg-icons/image/remove-red-eye';

import { Form } from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'

import BreadcrumbInstance from './BreadcrumbInstance.jsx'
import {toFuzzyTime} from '../../utils/general'
import {insertFile, deleteFile, updateFile}  from '../../actions/ReduxTaskActions'
import LoadingIndicator from '../LoadingIndicator.jsx'
import TreeModal from '../common/Tree.jsx'


const IMG_ROOT = '../../../../images/'

const isFolder = file =>  file.mimeType ==='application/vnd.google-apps.folder'
const isNotTrash = file => !file.trashed

const getImage = type => {
  if (type.includes('image/')) {
    return IMG_ROOT + 'icon_11_image_list.png'
  } else if (type.includes('spreadsheet')) {
    return IMG_ROOT + 'icon_11_spreadsheet_list.png'
  } else if (type.includes('presentation')) {
    return IMG_ROOT + 'icon_11_presentation_list.png'
  } else if (type.includes('pdf')) {
    return IMG_ROOT + 'icon_12_pdf_list.png'
  } else if (type.includes('zip') || type.includes('compressed')) {
    return IMG_ROOT + 'icon_9_archive_list.png'
  } else if (type.includes('word')) {
    return IMG_ROOT + 'icon_11_document_list.png'
  } else if (type.includes('text/')) {
    return IMG_ROOT + 'icon_10_text_list.png'
  } else {
    return IMG_ROOT + 'generic_app_icon_16.png'
  }
}


class FilesList extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedFile: {},
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
    let imgSrc = getImage(fileData.type)
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
      let data = {'text':folder.name, 'id':folder.id, 'parents':folder.parents }
      data.disabled = data.id === disableFileId
      return data
    })
    let parentChildrenDict = {}

    folders.map(folder=>{
      let parent = folder.parents[0]
      if(parentChildrenDict[parent]) {
        parentChildrenDict[parent].push(folder)
      } else {
        parentChildrenDict[parent] = [folder]
      }
    })

    let root = {'text':'root', 'id':this.props.rootFolderId, 'children':[]}
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

  handleRenmaeModalOpen(file) {
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
            onTouchTap={this.handleClose.bind(this)} />,
        <FlatButton
            key={23}
            label="Submit"
            primary={true}
            onTouchTap={this.onDialogSubmit.bind(this)}
            disabled={!this.state.canSubmit} />
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

  renderDropzone() {
    // If user is logged in and already configured root folder
    return (this.props.app.is_linked_to_drive && this.props.rootFolderId &&
      <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} className="drive-drop-zone">
        <p>Drop a file here, or click to select a file to upload.</p>
      </Dropzone>
    )
  }
  renderCreateFolderButton() {
    // If user is logged in and already configured root folder
    return (this.props.app.is_linked_to_drive && this.props.rootFolderId &&
      <RaisedButton
        label="Create Folder"
        onTouchTap={this.createFolder.bind(this)}
        primary={true}
        />
    )
  }
  renderFilePreview(file) {
    let tableData = (
      <td>
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
          <img src={file.iconLink}/><span className="table-filename">{file.name}</span>
        </td>
        {tableData}
        <td></td>
      </tr>
    )
  }
  renderFileStandard(file) {
    let lastModifyingUser = + file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
    let lastModified = toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser

    return (
      <tr className="table-row-file" key={file.id}>
        <td onClick={this.navigate.bind(this, file.id)} >
          <img src={file.iconLink}/><span className="table-filename">{file.name}</span>
        </td>
        <td onClick={this.navigate.bind(this, file.id)} >
          {lastModified}
        </td>
        <td>
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
            <MenuItem primaryText="preview" leftIcon={<RemoveRedEye />} onTouchTap={this.navigate.bind(this, file.id)}/>
            <Divider/>
            { !isFolder(file) && <MenuItem primaryText="make a copy" leftIcon={<ContentCopy />} onTouchTap={this.copyFile.bind(this, file.id)}/>}
            <MenuItem primaryText="Rename" leftIcon={<Rename />} onTouchTap={this.handleRenmaeModalOpen.bind(this, file)} />
            <MenuItem primaryText="Move" leftIcon={<Move />} onTouchTap={this.handleMoveModalOpen.bind(this, file)} />
            <Divider/>
            <MenuItem primaryText="Delete" leftIcon={<Delete />} onTouchTap={this.removeFile.bind(this, file.id)}/>

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

    let tableBody =
    <tr>
      <td className="no-items" colSpan={3} rowSpan={3}><LoadingIndicator className="loading-indicator"/></td>
    </tr>

    if (!app.files.loading) {
      tableBody =
      <tr>
        <td className="no-items" colSpan={3} rowSpan={3}><h3>No files here</h3></td>
      </tr>
      if (filesToDisplay.length > 0) {
        tableBody = filesToDisplay.map(file => {
         if (file.isPreview) {
           return this.renderFilePreview(file)
         } else {
           return this.renderFileStandard(file)
         }
       })
      }
    } // not loading

    return (
      <div className="file-area">

        <BreadcrumbInstance
          directories={directoryStructure}
          initUpperLevelFolder={actions.initUpperLevelFolder.bind(this)}
          projectId={projectId}
          key={'breadcrumb_' + projectId}
          />

        {this.renderRenameModal()}
        {this.renderMoveModal()}
        {this.renderDropzone()}
        {this.renderCreateFolderButton()}
        <Table hover responsive condensed>
          <thead>
            <tr>
              <th>Name</th>
              <th>Last modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </Table>

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
