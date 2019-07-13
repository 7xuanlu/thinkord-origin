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
      files: []
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
  }
  //for files that are not images.
  OpenFileButton(filepath, e) {
    shell.openItem(filepath)
  }

  deleteButton(filepath, e) {
    console.log(filepath)
    this.setState({
      files: [...this.state.files.filter((file) => file.path !== filepath)]
    })
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
            <Image
              src={file.path}
              className="file_img"
              width={300}
              height={200}
            />
          </li>
        )
      } else {
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
            <br/>
            <aside className="file_upload">
              {files}
            </aside>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Uploadfile;