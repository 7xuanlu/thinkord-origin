import React, { Component } from 'react';

export default class FileIcon extends Component{
    constructor(props){
        super(props);
    }

    ChooseFileIcon = (file) => {
        if (file.split('.').pop() === 'docx') {
            return (
                <i className="far fa-file-word fa-3x file_preview_icon"></i>
            )
        } else if (file.split('.').pop() === 'pdf') {
            return (
                <i className="far fa-file-pdf fa-3x file_preview_icon"></i>
            )
        } else if (file.split('.').pop() === 'wav') {
            return (
                <i className="far fa-file-audio fa-3x file_preview_icon"></i>
            )
        } else if (file.split('.').pop() === 'mp4') {
            return (
                <i className="far fa-file-video fa-3x file_preview_icon"></i>
            )
        } else if (file.split('.').pop() === 'xls') {
            return (
                <i className="far fa-file-excel fa-3x file_preview_icon"></i>
            )
        } else if (file.split('.').pop() === 'zip') {
            return (
                <i className="far fa-file-archive fa-3x file_preview_icon"></i>
            )
        } else {
            return (
                <i className="far fa-file-alt fa-3x file_preview_icon"></i>
            )
        }
    }

    render(){
        return(
            <div className="file-icon-container">{this.ChooseFileIcon(this.props.file)}</div>
        )
    }
}