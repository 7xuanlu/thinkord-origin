import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { shell } from 'electron';
import FileIcon from '../components/FileIcon';


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
                        {/* {console.log(uppaths[index])} */}
                        {upname}
                        <i className="far fa-file file_edit_icon" onClick={(e) => this.openFileButton(upname, e)}></i>
                        <i className="fas fa-trash-alt file_edit_icon" onClick={(e) => this.deleteButton(upname, e)}></i>
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
                        <Container {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            {isDragActive ? 'Drop it!' : 'Drag and drop some files here, or click to select files'}
                        </Container>

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


// should be the component
const getColor = (props) => {
    return '#69CB43';
}
const Container = styled.div`
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding:20px;
            border-width: 1.5px;
            border-radius: 2px;
            border-color: ${props => getColor(props)};
            border-style: dashed;
            background-color: #fafafa;
            color: #69CB43;
            outline: none;
            transition: border .24s ease-in-out;
          `;