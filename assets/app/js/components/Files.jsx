import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {loginGoogle} from '../utils/auth'
import {getChildrenFiles} from '../utils/apiUtil'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

class BreadcrumbInstance extends Component {
    changeCurrentDirectory(directoryId) {
        this.props.initUpperLevelFolder(directoryId)
    }

    render() {
        let breadcrumbItems = this.props.directories.map((directory, index) => {
            if (index === this.props.directories.length - 1) {
                return (
                    <BreadcrumbItem
                        active
                        key={directory.id}>
                        {directory.name}
                    </BreadcrumbItem>
                )
            }

            return (
                <BreadcrumbItem
                    onClick={this.changeCurrentDirectory.bind(this, directory.id)}
                    key={directory.id}>
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

    toFuzzyTime(time) {
        return vagueTime.get({
            to: new Date(time).getTime()/1000, // convert ISO UTC to seconds from epoch
            units: 's'
        })
    }

    navigate(fileId) {
        let selectedFile = this.props.files.filter(file => file.id === fileId)[0]
        if (selectedFile.mimeType === 'application/vnd.google-apps.folder') {
            this.props.actions.initChildrenFiles(selectedFile.id, selectedFile.name)
        } else {
            window.open(selectedFile.webViewLink, '_newtab')
        }
    }

    render() {

        let rows = this.props.files.map(file => {
            let lastModifyingUser = file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
            let lastModified = this.toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser
            return (
                <tr className="table-row-file" onClick={this.navigate.bind(this, file.id)} key={file.id}>
                    <td><img src={file.iconLink}/><span className="table-filename">{file.name}</span></td>
                    <td>{lastModified}</td>
                </tr>
            )
        })

        let directories = this.props.directoryStructure

        return (
            <div>
                <BreadcrumbInstance
                    directories={directories}
                    initUpperLevelFolder={this.props.actions.initUpperLevelFolder.bind(this)}
                />
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last modified</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class Files extends Component {
    constructor(props, context) {
        super(props, context)
    }

    setAsRoot(id) {
        this.props.actions.setDirectoryAsRoot(id)
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

        if (app.logged_into_google && app.root_folder) {
            return (
                <FilesList
                    directoryStructure={app.directory_structure}
                    files={this.props.files}
                    actions={this.props.actions}
                />)
        }

        if (!app.logged_into_google && app.root_folder) {
            return (
                <div>
                    <span>Please authorize Google Drive</span>
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
        let currentDirectory = app.directory_structure[app.directory_structure.length-1] || 'root'

        if (!app.logged_into_google && !app.root_folder) {
            content = (
                <RaisedButton
                    label="Authorize"
                    onTouchTap={this.authorizeDrive.bind(this)}
                    primary={true}
                />
            )
        } else if (app.logged_into_google && !app.root_folder) {
            currentStep = 1
            content = (
                <div>
                    <FilesList
                        directoryStructure={app.directory_structure}
                        files={this.props.files}
                        actions={this.props.actions}
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