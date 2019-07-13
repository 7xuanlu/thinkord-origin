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
  OpenFileButton(e, filepath) {
    console.log(e, filepath)
    shell.openItem(e, filepath)
  }

  render() {

    const getColor = (props) => {
      return '#eeeeee';
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
      color: #bdbdbd;
      outline: none;
      transition: border .24s ease-in-out;
    `;

    // const imagePreviewUrl = this.state;
    const files = this.state.files.map(file => {
      const fileType = file['type'];
      let imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (imageTypes.includes(fileType)) {
        return (
          <div>
            <li key={file.name}>
              {file.name}
              <br />
              <Image
                src={file.path}
                width={600}
                height={400}
              />
            </li>
          </div>
        )
      } else {
        return (
          <div>
            <li key={file.name}>
              {file.name}
              <br />
              <Button
                id="fileBtn"
                size='sm'
                onClick={this.OpenFileButton.bind(this, file.path)}
              >open!</Button>
            </li>
          </div>
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
            <aside>
              <h4>Files</h4>
              {files}

            </aside>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Uploadfile;