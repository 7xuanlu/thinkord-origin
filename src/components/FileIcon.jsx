import React, { Component } from 'react';
// import icon
import CommonIcon from"../asset/uploadfile/file-alt.svg"
import ZipIcon from"../asset/uploadfile/file-archive.svg"
import AudioIcon from"../asset/uploadfile/file-audio.svg"
import ExcelIcon from"../asset/uploadfile/file-excel.svg"
import PdfIcon from"../asset/uploadfile/file-pdf.svg"
import VideoIcon from"../asset/uploadfile/file-video.svg"
import WordIcon from"../asset/uploadfile/file-word.svg"

export default class FileIcon extends Component{
    constructor(props){
        super(props);
    }

    ChooseFileIcon = (file) => {
        if (file.split('.').pop() === 'docx') {
            return (
                <img src={WordIcon}></img>
            )
        } else if (file.split('.').pop() === 'pdf') {
            return (
                <img src={PdfIcon}></img>
            )
        } else if (file.split('.').pop() === 'wav') {
            return (
                <img src={AudioIcon}></img>
            )
        } else if (file.split('.').pop() === 'mp4') {
            return (
                <img src={VideoIcon}></img>
            )
        } else if (file.split('.').pop() === 'xls') {
            return (
                <img src={ExcelIcon}></img>
            )
        } else if (file.split('.').pop() === 'zip') {
            return (
                <img src={ZipIcon}></img>
            )
        } else {
            return (
                <img src={CommonIcon}></img>
            )
        }
    }

    render(){
        return(
            <div className="file-icon-container">{this.ChooseFileIcon(this.props.file)}</div>
        )
    }
}