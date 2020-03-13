import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";
import FileIcon from '../asset/Thinkord-LOGO.png';

const { ipcRenderer } = require('electron');

export default class FileButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rename_file: '',
            rename_show: false,
            delete_file: '',
            delete_show: false
        }
    }

    // When you click the file button, the collection will show
    EnterCollection = (path) => {
        ipcRenderer.send('file-open-click', { path: path });
    }

    // Show the rename dialog
    handleRenameDialog = (path) => {
        let filename = path.split('\\').pop();
        filename = filename.split('.')[0];
        this.setState({
            rename_file: filename,
            rename_show: true
        });
    }

    // Close the rename dialog
    handleRenameDialogClose = () => {
        this.setState({ rename_show: false });
    }

    // Change the collection name
    handleRename = (path, index) => {
        let newCollectionName = document.getElementById('new_filename').value;
        document.getElementById("label_" + index).innerText = newCollectionName;
        ipcRenderer.send('rename-collection', {
            collectionPath: path,
            newCollectionName: newCollectionName,
            collectionIdx: index
        });
        this.setState({ rename_show: false });
    }

    // Show the delete dialog
    handleDeleteDialog = (path) => {
        let filename = path.split('\\').pop();
        filename = filename.split('.')[0];
        this.setState({
            delete_file: filename,
            delete_show: true
        });
    }

    // Close the delete dialog
    handleDeleteDialogClose = () => { this.setState({ delete_show: false }); }

    // Delete the collectioin
    handleDelete = (path, index) => {
        ipcRenderer.send('delete-collection', {
            collectionPath: path,
            collectionIdx: index
        });
        this.setState({ delete_show: false });
    }

    render() {
        const labelid = "label_" + this.props.index;

        return (
            <div>
                <ContextMenuTrigger id={this.props.file.path}>
                    <button
                        id={this.props.index}
                        className={this.props.index > 4 && this.props.expand === false ? "btn hidden" : "btn"}
                        onDoubleClick={() => this.EnterCollection(this.props.file.path)}
                    >
                        <img className="file_icon" src={FileIcon} /><br />
                        <div id={labelid}>{this.props.file.name}</div>
                    </button>
                </ContextMenuTrigger>
                <ContextMenu id={this.props.file.path} className="pop_menu">
                    <MenuItem id="pop_rename" onClick={() => this.handleRenameDialog(this.props.file.path)}>
                        <i className="fas fa-pen-square"></i> Rename
                    </MenuItem>
                    <MenuItem id="pop_deletet" onClick={() => this.handleDeleteDialog(this.props.file.path)}>
                        <i className="fas fa-trash-alt"></i> Delete
                    </MenuItem>
                </ContextMenu>

                <Modal show={this.state.rename_show} centered>
                    <Modal.Header className="modal_header">
                        <Modal.Title>Rename</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input id="new_filename" type="text" defaultValue={this.state.rename_file} className="modal_input"></input>
                    </Modal.Body>
                    <Modal.Footer className="modal_footer">
                        <i className="modal_icon fas fa-check-circle" onClick={() => {
                            this.handleRename(this.props.file.path, this.props.index);
                        }}></i>
                        <i className="modal_icon fas fa-times-circle" onClick={this.handleRenameDialogClose}></i>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.delete_show} centered>
                    <Modal.Header className="modal_header">
                        <Modal.Title>Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you really want to delete file "{this.state.delete_file}" ?</Modal.Body>
                    <Modal.Footer className="modal_footer">
                        <i className="modal_icon fas fa-check-circle" onClick={() => {
                            this.handleDelete(this.props.file.path, this.props.index);
                        }}></i>
                        <i className="modal_icon fas fa-times-circle" onClick={this.handleDeleteDialogClose}></i>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
