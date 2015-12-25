import React, { Component, PropTypes } from 'react'
import Table from 'material-ui/lib/table/table'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {loginGoogle} from '../utils/auth'

require('rc-steps/assets/index.css');
require('rc-steps/assets/iconfont.css');

class FilesList extends Component {

    toFuzzyTime(time) {
        return vagueTime.get({
            to: new Date(time).getTime()/1000, // convert ISO UTC to seconds from epoch
            units: 's'
        })
    }

    render() {
        let filesToShow = this.props.files.filter(file => {
            return this.props.displayedFiles.indexOf(file.id) > -1
        })

        let rows = filesToShow.map(file => {
            let lastModifyingUser = file.lastModifyingUser.me ? 'me' : file.lastModifyingUser.displayName
            let lastModified = this.toFuzzyTime(file.modifiedTime) + ' by ' + lastModifyingUser
            return (
                <TableRow key={file.id}>
                    <TableRowColumn>{file.name}</TableRowColumn>
                    <TableRowColumn>{lastModified}</TableRowColumn>
                </TableRow>
            )
        })

        return (
            <div>
                <Table fixedHeader={true}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Last modified</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        selectable={false}
                        showRowHover={true}
                    >
                        {rows}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

class Files extends Component {
    constructor(props, context) {
        super(props, context)
    }

    setAsRoot() {
        this.props.actions.updateAppStatus({
            root_folder: '123'
        })
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
            //todo: grab files if haven't
            return (
                <FilesList
                    displayedFiles={app.displayed_files}
                    files={this.props.files}
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
                    <RaisedButton
                        label="Set current directory as root"
                        onTouchTap={this.setAsRoot.bind(this)}
                        secondary={true}
                    />
                    <FilesList
                        displayedFiles={app.displayed_files}
                        files={this.props.files}
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