import React, { Component, PropTypes } from 'react'
import Table from 'material-ui/lib/table/table'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import FlatButton from 'material-ui/lib/flat-button'
import gapi from '../gapi'
import vagueTime from 'vague-time'

class AuthorizeButton extends Component {
    render() {
        return (
            <div id="authorize-div">
                <span>Authorize access to Drive API</span>
                <FlatButton
                    label="Authorize!"
                    onTouchTap={this.props.authorizeDrive}
                    primary={true}
                />
            </div>
        )
    }
}

class FilesList extends Component {

    render() {
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
                        {this.props.rows}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

class UnlinkedFilesList extends Component {
    render() {
        return (
            <div className="not-linked">
                <div><span>You have not linked a Google Drive folder with this project.</span></div>
                <FlatButton
                    label="Link one now!"
                    onTouchTap={this.props.linkGoogleDrive}
                    primary={true}
                />
            </div>
        )
    }
}

class LinkingFilesList extends Component {

    setAsRoot() {
        console.log('root')
    }

    render() {
        let button = null
        return (
            <div>
                <FilesList rows={this.props.rows} />
                <FlatButton
                    label="Set current directory as root"
                    onTouchTap={this.setAsRoot.bind(this)}
                    secondary={true}
                />
            </div>
        )
    }
}


class Files extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            link_status: 'not-linked',
            parent: {}, // {child: parent}
            children: {} // {parent: [children]}
        }
    }

    toFuzzyTime(time) {
        return vagueTime.get({
            to: new Date(time).getTime()/1000, // convert ISO UTC to seconds from epoch
            units: 's'
        })
    }

    linkGoogleDrive() {
        this.setState({
            link_status: 'linking'
        })

        let parent = {}
        let children = {}
        let topLevelFolders = []

        let self = this;
        let requestList = gapi.client.request({
            'path': '/drive/v3/files',
            'method': 'GET',
            'params': {
                'pageSize': '1000',
                'orderBy': 'modifiedTime desc',
                'spaces': 'drive',
                'q': "mimeType = 'application/vnd.google-apps.folder'",
                'fields': 'files'
            }
        })
        requestList.then(res => {
            // get each file's parent and children
            res.result.files.forEach(file => {
                if (file.parents) {
                    let parentOfThisFile = file.parents[0]
                    parent[file.id] = parentOfThisFile // assume one parent for now

                    if (!children[parentOfThisFile]) {
                        children[parentOfThisFile] = []
                    }
                    children[parentOfThisFile].push(file.id)
                } else {
                    topLevelFolders.push(file)
                }
            })
            self.setState({
                parent: parent,
                children: children
            })
            self.props.actions.updateAppStatus({displayed_files: topLevelFolders.map(folder => folder.id)})
            self.props.actions.initFiles(topLevelFolders)
        }, function(err) {
            console.log(err)
        });

    }

    render() {
        if (!this.props.loggedInGoogle) {
            return <AuthorizeButton authorizeDrive={this.props.authorizeDrive}/>
        } else if (this.state.link_status === 'not-linked') {
            return <UnlinkedFilesList  linkGoogleDrive={this.linkGoogleDrive.bind(this)}/>
        } else {
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

            if (this.state.link_status === 'linking') {
                return <LinkingFilesList rows={rows}/>
            } else if (this.state.link_status === 'linked') {
                return <FilesList rows={rows}/>
            }
        }
    }
}

export default Files;
     