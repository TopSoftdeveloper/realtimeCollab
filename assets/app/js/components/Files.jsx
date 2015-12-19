import React, { Component, PropTypes } from 'react'
import Table from 'material-ui/lib/table/table'
import TableBody from 'material-ui/lib/table/table-body'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'

class AuthorizeButton extends Component {
    render() {
        return (
            <div id="authorize-div">
                <span>Authorize access to Drive API     </span>
                <button className="btn" id="authorize-button">
                    Authorize
                </button>
            </div>
        )
    }
}

class Files extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let rows = this.props.files.map(file => {
            return (
                <TableRow key={file.id}>
                    <TableRowColumn>{file.mimeType}</TableRowColumn>
                    <TableRowColumn>{file.name}</TableRowColumn>
                </TableRow>
            )
        })

        return (
            <div>
                <Table fixedHeader={true}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>File type</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
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

export default Files;
     