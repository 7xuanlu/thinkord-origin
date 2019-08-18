import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
// import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Image from 'react-image-resizer';
import { shell } from 'electron';

class Uploadfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      drop: false
    };
    this.OpenFileButton = this.OpenFileButton.bind(this);
  }

  onDrop(files) {
    let filepaths = []

    files.map((file) => {
      filepaths.push(file.path)
    })
    this.setState({
      files: this.state.files.concat(files.map(file => Object.assign(file, {
        preview: filepaths
      }))),
      drop: true
    })

    this.props.addFile(this.state.files, this.props.time)
  }
  //for files that are not images.
  OpenFileButton(filepath, e) {
    shell.openItem(filepath)
  }

  deleteButton(filepath, e) {
    this.setState({
      files: [...this.state.files.filter((file) => file.path !== filepath)]
    })
    this.props.delFile(this.state.files, this.props.time);
  }

  componentDidUpdate() {
    // console.log(this.state.files)
  }

  componentDidMount() {
    if (this.state.drop) {
      console.log(this.props.paths)

    }


  }


  processReloadFile = () => {
    let uploadpaths = [];
    let pathSplit;
    let fileNames = [];
    let fileName;
    let files;
    let imageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (this.props.paths.length !== 1) {
      this.props.paths.map((path, index) => {
        if (index !== 0) {
          uploadpaths.push(path)
        }
      })
    }

    files = uploadpaths.map((path) => {
      pathSplit = path.split('\\')
      fileName = pathSplit[pathSplit.length - 1]

      fileNames.push(fileName);
      if (imageTypes.includes(fileName.split('.')[1])) {
        return (
          <li key={path}>
            {fileName}
            <i onClick={(e) => this.OpenFileButton(path, e)}>click</i>
            <i onClick={(e) => this.deleteButton(path, e)}>delete</i>
          </li>

        )
      } else {
        return (
          <li key={path}>
            {fileName}
            <i onClick={(e) => this.OpenFileButton(path, e)}>click</i>
            <i onClick={(e) => this.deleteButton(path, e)}>delete</i>
          </li>

        )
      }
    })
    return files;
  }

  ChooseFileIcon = (file) => {
    if (file.name.split('.').pop() === 'docx') {
      return (
        <i className="far fa-file-word fa-3x file_preview_icon"></i>
      )
    } else if (file.name.split('.').pop() === 'pdf') {
      return (
        <i className="far fa-file-pdf fa-3x file_preview_icon"></i>
      )
    } else if (file.name.split('.').pop() === 'mp3') {
      return (
        <i className="far fa-file-audio fa-3x file_preview_icon"></i>
      )
    } else if (file.name.split('.').pop() === 'mp4') {
      return (
        <i className="far fa-file-video fa-3x file_preview_icon"></i>
      )
    } else if (file.name.split('.').pop() === 'xls') {
      return (
        <i className="far fa-file-excel fa-3x file_preview_icon"></i>
      )
    } else if (file.name.split('.').pop() === 'zip') {
      return (
        <i className="far fa-file-archive fa-3x file_preview_icon"></i>
      )
    } else {
      return (
        <i className="far fa-file-alt fa-3x file_preview_icon"></i>
      )
    }
  }

  distFile = (files) => {
    return (
      <aside className="file_upload">
        {files}
      </aside>
    )
  }



  render() {
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

    // distinguish the action of dropping files or reloading data
    let files = this.state.drop ?
      this.state.files.map(file => {
        const fileType = file['type'];
        let imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (imageTypes.includes(fileType)) {
          return (
            <li key={file.name}>
              {file.name}
              <i
                id="fileBtn"
                size='sm'
                className="far fa-file file_edit_icon"
                onClick={(e) => this.OpenFileButton(file.path, e)}
              >
              </i>
              <i
                size="sm"
                onClick={(e) => this.deleteButton(file.path, e)}
                className="fas fa-trash-alt file_edit_icon"
              >
              </i>
              <div className="file_img">
                <Image
                  src={file.path}
                  width={300}
                  height={200}
                />
              </div>
            </li>
          )
        } else {
          return (
            <li key={file.name}>
              {file.name && (
                this.ChooseFileIcon(file)
              )}
              {file.name}
              <i
                id="fileBtn"
                size='sm'
                className="far fa-file file_edit_icon"
                onClick={(e) => this.OpenFileButton(file.path, e)}
              >
              </i>
              <i
                size="sm"
                onClick={(e) => this.deleteButton(file.path, e)}
                className="fas fa-trash-alt file_edit_icon"
              >
              </i>
            </li>
          )
        }
      }) : this.processReloadFile()



    return (
      <Dropzone onDrop={this.onDrop.bind(this)}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className="container">
            <Container {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {isDragActive ? 'Drop it!' : 'Drag and drop some files here, or click to select files'}
            </Container>
            {this.distFile(files)}
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Uploadfile;