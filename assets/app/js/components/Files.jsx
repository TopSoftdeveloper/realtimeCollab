import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import {toFuzzyTime} from '../utils/general'
import FlatButton from 'material-ui/lib/flat-button'
import {insertFile, deleteFile, updateFile}  from '../actions/ReduxTaskActions'
import LinearProgress from 'material-ui/lib/linear-progress'
import LoadingIndicator from './LoadingIndicator.jsx'

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');
const IMG_ROOT = '../../../images/'

class BreadcrumbInstance extends Component {
    changeCurrentDirectory(directoryId) {
        this.props.initUpperLevelFolder(this.props.projectId, directoryId)
    }

    render() {
        let breadcrumbItems = this.props.directories.map((directory, index) => {
            if (index === this.props.directories.length - 1) {
                return (
                    <BreadcrumbItem
                        active
                        key={_.uniqueId('breadcrumb')}>
                        {directory.name}
                    </BreadcrumbItem>
                )
            }

            return (
                <BreadcrumbItem
                    onClick={this.changeCurrentDirectory.bind(this, directory.id)}
                    key={_.uniqueId('breadcrumb')}>
                    {directory.name}
                </BreadcrumbItem>
            )
        })

        return (
            <Breadcrumb>
                {breadcrumbItems}
            </Breadcrumb>
        )
    }
}

class FilesList extends Component {
    onDrop(files) {
        let file = files[0]
        this.renderFilePreview(file)
    }

    uploadFile(file, e) {
        this.props.dispatch(updateFile(file.id, {uploading: true}))
        let directoryStructure = this.props.directoryStructure
        let currDirectory = directoryStructure[directoryStructure.length-1].id
        this.props.actions.uploadFileToDrive(file, currDirectory, this.props.projectId)
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

    navigate(fileId) {
        let selectedFile = this.props.files.filter(file => file.id === fileId)[0]
        if (selectedFile.mimeType === 'application/vnd.google-apps.folder') {
            this.props.actions.initChildrenFiles(this.props.projectId, selectedFile.id, selectedFile.name)
        } else {
            window.open(selectedFile.webViewLink, '_newtab')
        }
    }

    removePreview(id) {
        this.props.dispatch(deleteFile(id))
    }

    render() {
        let directories = this.props.directoryStructure
        // only display files under the current directory
        let filesToDisplay = []
        if (directories.length > 0) {
            filesToDisplay = this.props.files.filter(file => {
                let currDirectory = directories[directories.length-1].id
                return file.parents && file.parents[0] === currDirectory && !file.trashed
            })
        }

        let table = <LoadingIndicator className="loading-indicator"/>

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
                        </tr>
                    )
                } //file.isPreview

                let lastModifyingUser = file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
                let lastModified = toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser
                return (
                    <tr className="table-row-file" onClick={this.navigate.bind(this, file.id)} key={file.id}>
                        <td><img src={file.iconLink}/><span className="table-filename">{file.name}</span></td>
                        <td>{lastModified}</td>
                    </tr>
                )
            })

            if (rows.length === 0) {
                table = <div className="no-items"><h3>No files here</h3></div>
            } else {
                table = (
                    <Table>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                )
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

        return (
            <div className="file-area">
                <BreadcrumbInstance
                    directories={directories}
                    initUpperLevelFolder={this.props.actions.initUpperLevelFolder.bind(this)}
                    projectId={this.props.projectId}
                    key={'breadcrumb_' + this.props.projectId}
                />
                {dropzone}
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last modified</th>
                    </tr>
                    </thead>
                </Table>
                <div className="files-list">
                    {table}
                </div>
            </div>
        )
    }
}

class Files extends Component {
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

export default Files