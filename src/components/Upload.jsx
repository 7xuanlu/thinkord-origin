import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import { shell } from 'electron';
import FileIcon from '../components/FileIcon';

//icon
import CommonIcon from"../asset/uploadfile/file-alt.svg"
import TrashIcon from"../asset/uploadfile/upload-trash-alt.svg"


export class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }

    onDrop(files) {
        // when you upload new files, which won't override the old one
        this.setState({
            files: this.state.files.concat(files.map(file => Object.assign(file, {
                preview: files
            }))),
        })
        this.props.addFile(this.state.files, this.props.time)
    }

    openFileButton(upname, e) {
        this.props.paths.map((path) => {
            if (path.split('\\').includes(upname)) {
                shell.openItem(path)
            }
        })
    }

    deleteButton(upname, e) {
        this.props.paths.map((path) => {
            if (path.split('\\').includes(upname)) {
                // because setState isn't prove to be synchronous
                // but we need to pass the changed this.state.files to this.props.delFile
                // so we use callback
                this.setState({
                    files: [...this.state.files.filter((file) => file.path !== path)]
                }, () => {
                    this.props.delFile(this.state.files, this.props.time)
                })
            }
        })
    }


    componentDidUpdate() {
        // console.log('componentDidUpdate state: ', this.state.files)
    }

    // we want the name of the path, so we need to process it
    // args: this.props.paths as paths
    processPath = (paths) => {
        let uppaths = []
        let upnames = []
        if (paths.length > 1) {
            paths.slice(1).map((path) => {
                uppaths.push(path)
            })
            uppaths.map((uppath) => {
                upnames.push(uppath.split('\\')[uppath.split('\\').length - 1])
            })
            let names = upnames.map((upname, index) => {
                return (
                    <li key={index} className="file_li">
                        <FileIcon file={uppaths[index]}/>
                        {upname}
                        <img className="file_option" src={CommonIcon} onClick={(e) => this.openFileButton(upname, e)}></img>
                        <img className="file_option" src={TrashIcon} onClick={(e) => this.openFileButton(upname, e)}></img>
                    </li>
                )
            })
            return (
                <ul>{names}</ul>
            )
        }
    }


    render() {
        return (
            <Dropzone onDrop={this.onDrop.bind(this)}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div className="container">
                        <div {...getRootProps({ className: 'dropzone upload_file_zone' })}>
                            <input {...getInputProps()} />
                            {isDragActive ? 'Drop it!' : 'Drag and drop some files here, or click to select files'}
                        </div>

                        {/* always pass this.props.paths, not only for the dropping new files, 
                            but also for reloading the saved file from json */}
                        {this.processPath(this.props.paths)}
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default Upload