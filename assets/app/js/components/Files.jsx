import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {loginGoogle, isLoggedIntoGoogle} from '../utils/auth'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import {toFuzzyTime} from '../utils/general'
require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

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

    navigate(fileId) {
        let selectedFile = this.props.files.filter(file => file.id === fileId)[0]
        if (selectedFile.mimeType === 'application/vnd.google-apps.folder') {
            this.props.actions.initChildrenFiles(this.props.projectId, selectedFile.id, selectedFile.name)
        } else {
            window.open(selectedFile.webViewLink, '_newtab')
        }
    }

    render() {
        let directories = this.props.directoryStructure
        // only display files under the current directory
        let filesToDisplay = []
        if (directories.length > 0) {
            filesToDisplay = this.props.files.filter(file => {
                let currDirectory = directories[directories.length-1].id
                return file.parents && file.parents[0] === currDirectory
            })
        }

        let rows = filesToDisplay.map(file => {
            let lastModifyingUser = file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
            let lastModified = toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser
            return (
                <tr className="table-row-file" onClick={this.navigate.bind(this, file.id)} key={file.id}>
                    <td><img src={file.iconLink}/><span className="table-filename">{file.name}</span></td>
                    <td>{lastModified}</td>
                </tr>
            )
        })

        return (
            <div className="file-area">
                <BreadcrumbInstance
                    directories={directories}
                    initUpperLevelFolder={this.props.actions.initUpperLevelFolder.bind(this)}
                    projectId={this.props.projectId}
                    key={'breadcrumb_' + this.props.projectId}
                />
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last modified</th>
                    </tr>
                    </thead>
                </Table>
                <div className="files-list">
                <Table>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
                </div>
            </div>
        )
    }
}
import gapi from '../gapi'
/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Callback function to call when the request is complete.
 */


class Files extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            preview: ''
        }
    }
    insertFileData(fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octect-stream';
            var metadata = {
                'name': fileData.name,
                'mimeType': contentType
            };
            let directoryStructure = this.props.project.directory_structure
            let currDirectory = directoryStructure[directoryStructure.length-1].id
            metadata.parents = [currDirectory]


                var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v3/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});
            if (!callback) {
                callback = function(file) {
                    console.log(file)
                };
            }
            request.execute(callback);
        }.bind(this)
    }

    callmemaybe(res) {
        console.log('doneee')
        console.log(res)
    }

    onDrop(files) {
        let file = files[0]
        console.log(file)
        this.setState({preview: file.preview})
        this.insertFileData(file, this.callmemaybe)
        //this.props.actions.uploadFileToDrive(newFile)
    }

    componentDidMount() {
        let actions = this.props.actions
        let currentProject = this.props.project
        if (!this.props.app.logged_into_google) {
            isLoggedIntoGoogle(function(authResult) {
                if (authResult && !authResult.error) {
                    actions.loggedIntoGoogle()
                    actions.initializeFiles(currentProject)
                } else {
                    actions.loggedOutGoogle()
                }
            })
        } else {
            actions.initializeFiles(currentProject)
        }
    }

    setAsRoot(id) {
        this.props.actions.setDirectoryAsRoot(this.props.project.id, id)
    }

    authorizeDrive() {
        loginGoogle(function(authResult) {
            if (authResult && !authResult.error) {
                this.props.actions.loggedIntoGoogle()
            } else {
                this.props.actions.loggedOutGoogle()
            }
        }.bind(this))
    }

    render() {
        let app = this.props.app
        let project = this.props.project

        if (app.logged_into_google && project.root_folder) {
            return (
                <div>
                    <FilesList
                        directoryStructure={project.directory_structure}
                        files={this.props.files}
                        actions={this.props.actions}
                        projectId={project.id}
                    />
                    <br/>
                    <div>
                        <img src={this.state.preview} />
                    </div>
                    <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} multiple={false} className="drive-drop-zone">
                        <p>Drop a file here, or click to select a file to upload.</p>
                    </Dropzone>
                </div>
            )
        }

        if (!app.logged_into_google && project.root_folder) {
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

        if (!app.logged_into_google && !project.root_folder) {
            content = (
                <RaisedButton
                    label="Authorize"
                    onTouchTap={this.authorizeDrive.bind(this)}
                    primary={true}
                />
            )
        } else if (app.logged_into_google && !project.root_folder) {
            currentStep = 1
            content = (
                <div>
                    <FilesList
                        directoryStructure={project.directory_structure}
                        files={this.props.files}
                        actions={this.props.actions}
                        projectId={project.id}
                    />
                    <RaisedButton
                        label="Set current directory as root"
                        onTouchTap={this.setAsRoot.bind(this, currentDirectory.id)}
                        secondary={true}
                    />
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