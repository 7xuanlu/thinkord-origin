import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";

import FileIcon from '../asset/SLUNOTE-LOGO2.png';

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

    EnterTimeLine = (sluPath) => {
        ipcRenderer.send('file-open-click', {
            path: sluPath
        });
    }

    handleRenameDialog = (path) => {
        var filename = path.split('\\').pop();
        filename = filename.split('.')[0];
        this.setState({
            rename_file: filename,
            rename_show: true
        });
        console.log(path);
    }

    handleRenameDialogClose = () => {
        this.setState({
            rename_show: false
        })
    }

    handleRename = (path) => {
        var new_filename = document.getElementById('new_filename').value;
        ipcRenderer.send('main-rename-file', {
            path: path,
            new_filename: new_filename
        });
        this.setState({
            rename_show: false
        });
    }

    handleDeleteDialog = (path) => {
        var filename = path.split('\\').pop();
        filename = filename.split('.')[0];
        this.setState({
            delete_file: filename,
            delete_show: true
        })
        console.log(path);
    }

    handleDeleteDialogClose = () => {
        this.setState({
            delete_show: false
        })
    }

    handleDelete = (path) => {
        ipcRenderer.send('main-delete-file', {
            path: path
        });
        this.setState({
            delete_show: false
        });
    }

    render() {
        return (
            <div>
                <ContextMenuTrigger id={this.props.file.path}>
                    <button
                        id={this.props.index}
                        className={this.props.index > 3 ? "btn hidden" : "btn"}
                        onDoubleClick={() => this.EnterTimeLine(this.props.file.path)}
                    >
                        <img className="file_icon" src={FileIcon} /><br />
                        {this.props.file.path.split('\\').pop()}
                    </button>
                </ContextMenuTrigger>
                <ContextMenu id={this.props.file.path} className="pop_menu">
                    <MenuItem id="pop_rename" className="pop_btn" onClick={() => this.handleRenameDialog(this.props.file.path)}>
                        <i className="fas fa-pen-square"></i> Rename
                    </MenuItem>
                    <MenuItem id="pop_deletet" className="pop_btn" onClick={() => this.handleDeleteDialog(this.props.file.path)}>
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
                        <i className="modal_icon fas fa-check-circle" onClick={() => this.handleRename(this.props.file.path)}></i>
                        <i className="modal_icon fas fa-times-circle" onClick={this.handleRenameDialogClose}></i>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.delete_show} centered>
                    <Modal.Header className="modal_header">
                        <Modal.Title>Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you really want to delete file "{this.state.delete_file}" ?</Modal.Body>
                    <Modal.Footer className="modal_footer">
                        <i className="modal_icon fas fa-check-circle" onClick={() => this.handleDelete(this.props.file.path)}></i>
                        <i className="modal_icon fas fa-times-circle" onClick={this.handleDeleteDialogClose}></i>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}