import React, { Component, PropTypes } from 'react'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import {toFuzzyTime} from '../utils/general'
import {insertFile, deleteFile, updateFile}  from '../actions/ReduxTaskActions'

import LoadingIndicator from './LoadingIndicator.jsx'
import TreeModal from './common/Tree.jsx'
import BreadcrumbInstance from './common/BreadcrumbInstance.jsx'
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

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

const IMG_ROOT = '../../../images/'

const isFolder = file =>  file.mimeType ==='application/vnd.google-apps.folder'
const isNotTrash = file => !file.trashed




class FilesList extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedFile: {},
      isModalOpen: false,
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
      this.renderFilePreview(file)
    }
  }
  renderFilePreview(fileData) {
    let imgSrc = this.getImage(fileData.type)
    let directoryStructure = this.props.directoryStructure
    let currDirectory = directoryStructure[directoryStructure.length-1].id
    this.props.dispatch(insertFile({
      iconLink: imgSrc,
      id: _.uniqueId(),
      name: fileData.name,
      parents: [currDirectory],
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

    let root = {'text':'root', 'id':this.props.rootFolder, 'children':[]}
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
      isModalOpen: false,
      selectedFile: null,
      canSubmit:false,
    });
  }

  handleOpen(file) {
    this.setState({
      isModalOpen: true,
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

  getImage(type) {
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
  render() {
    const sortByFolderFirst = (fileA, fileB) => {
      if(!isFolder(fileA) && isFolder(fileB)) {
        return 1
      } else {
        return -1;
      }
    }
    let directories = this.props.directoryStructure
    // only display files under the current directory
    let filesToDisplay = []
    if (directories.length > 0) {
      filesToDisplay = this.props.files.filter(file => {
        let currDirectory = directories[directories.length-1].id
        return file.parents && file.parents[0] === currDirectory && !file.trashed
      }).sort(sortByFolderFirst)
    }

    let tableBody = <tr>
      <td className="no-items" colSpan={2} rowSpan={3}><LoadingIndicator className="loading-indicator"/></td>
    </tr>

    if (!this.props.app.files.loading) {
      var rows = filesToDisplay.map(file => {
        if (file.isPreview) {
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
        } //file.isPreview
        let lastModifyingUser = + file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
        let lastModified = toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser

        let iconStyle = {
          height: 10,
        }

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
                iconButtonElement={<IconButton><MoreVertIcon style='iconStyle'/></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                <MenuItem primaryText="preview" leftIcon={<RemoveRedEye />} onTouchTap={this.navigate.bind(this, file.id)}/>
                <Divider/>
                { !isFolder(file) && <MenuItem primaryText="make a copy" leftIcon={<ContentCopy />} onTouchTap={this.copyFile.bind(this, file.id)}/>}
                <MenuItem primaryText="Rename" leftIcon={<Rename />} onTouchTap={this.handleOpen.bind(this, file)} />
                <MenuItem primaryText="Move" leftIcon={<Move />} onTouchTap={this.handleMoveModalOpen.bind(this, file)} />
                <Divider/>
                <MenuItem primaryText="Delete" leftIcon={<Delete />} onTouchTap={this.removeFile.bind(this, file.id)}/>

              </IconMenu>
            </td>
          </tr>
        )
      })

      if (rows.length === 0) {
        tableBody = <tr>
          <td className="no-items" colSpan={2} rowSpan={3}><h3>No files here</h3></td>
        </tr>
      } else {
        tableBody = rows
      }

    } // not loading

    let dropzone = null
    if (this.props.app.is_linked_to_drive && this.props.rootFolder) {
      // If user is logged in and already configured root folder
      dropzone =
      <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} className="drive-drop-zone">
        <p>Drop a file here, or click to select a file to upload.</p>
      </Dropzone>
    }

    let actions = [
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

    let modal = (this.state.isModalOpen &&
        <Dialog
        autoScrollBodyContent
        actions={actions}
        onRequestClose={this.handleClose.bind(this)}
        open={this.state.isModalOpen}>
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

      const moveModal = (this.state.isMoveModalOpen &&
        <TreeModal
          handleClose = {this.handleMoveModalClose.bind(this)}
          onDialogSubmit={this.moveFile.bind(this, this.state.movedFile.id, this.state.movedFile.parents)}
          treeNode={this.computeDirectoryTree(this.state.movedFile.id)}
        />
      )


    return (
      <div className="file-area">

        <BreadcrumbInstance
          directories={directories}
          initUpperLevelFolder={this.props.actions.initUpperLevelFolder.bind(this)}
          projectId={this.props.projectId}
          key={'breadcrumb_' + this.props.projectId}
          />
        {dropzone}
        {modal}
        {moveModal}
        <RaisedButton
          label="Create Folder"
          onTouchTap={this.createFolder.bind(this)}
          primary={true}
          />
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
    console.log('get drive permission here')
  }

  render() {
    console.log('FileView::render()')
    let app = this.props.app
    let project = this.props.project
    let filesList = <FilesList
      directoryStructure={project.directory_structure}
      files={this.props.files}
      actions={this.props.actions}
      projectId={project.id}
      dispatch={this.props.dispatch}
      app={app}
      rootFolder={project.root_folder}
      />


    if (app.is_linked_to_drive && project.root_folder) {
      return (
        <div>
          {filesList}
        </div>
      )
    }

    if (!app.is_linked_to_drive && project.root_folder) {
      return (
        <div>
          <h4>Please re-authorize Google Drive</h4>
          <RaisedButton
            label="Authorize"
            onTouchTap={this.authorizeDrive.bind(this)}
            primary={true}
            />
        </div>
      )
    }

    let content = null
    let currentStep = 0
    let steps = [{title: 'Authorize Google Drive'}, {title: 'Select root folder'}]
    let currentDirectory = {name: 'Top level directory', id: 'root'}
    if (project.directory_structure && project.directory_structure.length > 0) {
      currentDirectory = project.directory_structure[project.directory_structure.length-1]
    }

    if (!app.is_linked_to_drive && !project.root_folder) {
      content = (
        <RaisedButton
          label="Authorize"
          onTouchTap={this.authorizeDrive.bind(this)}
          primary={true}
          />
      )
    } else if (app.is_linked_to_drive && !project.root_folder) {
      currentStep = 1
      let setDirectoryBtn = null
      if (!app.files.loading) {
        setDirectoryBtn = <RaisedButton
          className="set-root-dir"
          label="Set current directory as root"
          onTouchTap={this.setAsRoot.bind(this, currentDirectory.id)}
          secondary={true}
          />
      }
      content = (
        <div>
          {filesList}
          {setDirectoryBtn}
        </div>
      )
    }

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
