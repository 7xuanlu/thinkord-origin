import React, { Component } from 'react';
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";

import FileIcon from '../asset/SLUNOTE-LOGO2.png';

const { ipcRenderer } = require('electron');

export default class FileButton extends Component{
    constructor(props){
        super(props);
    }

    EnterTimeLine = (sluPath) => {
        ipcRenderer.send('file-open-click', {
            path: sluPath
        });
    }

    handleRename = (path) => {
        console.log(path);
    }

    handleDelete = (path) => {
        console.log(path);
    }

    render(){
        return(
            <div>
                <ContextMenuTrigger id = {this.props.file.path}>
                    <button
                        id = {this.props.index}
                        className = {this.props.index > 3 ? "btn hidden" : "btn"}
                        onDoubleClick = {() => this.EnterTimeLine(this.props.file.path)}
                    >
                        <img className="file_icon" src={FileIcon}/><br/>
                        {this.props.file.path.split('\\').pop()}
                    </button>
                </ContextMenuTrigger>
                <ContextMenu id = {this.props.file.path} className="pop_menu">
                    <MenuItem id="pop_rename" className="pop_btn" onClick={() => this.handleRename(this.props.file.path)}>
                        <i className="fas fa-pen-square"></i> Rename
                    </MenuItem>
                    <MenuItem id="pop_deletet" className="pop_btn" onClick={() => this.handleDelete(this.props.file.path)}>
                        <i className="fas fa-trash-alt"></i> Delete
                    </MenuItem>
                </ContextMenu>
            </div>
        )
    }
}