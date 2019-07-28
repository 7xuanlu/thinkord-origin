import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Image from 'react-image-resizer';
import { shell } from 'electron';

class Uploadfile extends Component {
  constructor(props) {
    super(props);
    // this.onDrop = (files) => {
    //   this.setState({files:this.state.files.concat(files)})
    // };
    this.state = {
      files: [],
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
      })))
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
  }

  componentDidUpdate() {
    // console.log(this.state.files);
    this.props.delFile(this.state.files, this.props.time);
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
      padding: 20px;
      border-width: 2px;
      border-radius: 2px;
      border-color: ${props => getColor(props)};
      border-style: dashed;
      background-color: #fafafa;
      color: #69CB43;
      outline: none;
      transition: border .24s ease-in-out;
    `;

    // const imagePreviewUrl = this.state;
    const files = this.state.files.map(file => {
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
            <br />
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
    })

    return (
      <Dropzone onDrop={this.onDrop.bind(this)}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className="container">
            <Container {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {isDragActive ? 'Drop it!' : 'Drag and drop some files here, or click to select files'}
            </Container>
            <br />


            {this.distFile(files)}

          </div>
        )}
      </Dropzone>
    );
  }
}

export default Uploadfile;