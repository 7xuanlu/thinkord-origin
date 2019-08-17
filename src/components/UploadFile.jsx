import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import FileIcon from '../components/FileIcon';
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

  distFile = (files) => {
    return (
      <aside className="file_upload">
        {files}
      </aside>
    )
  }

  render() {
    // const imagePreviewUrl = this.state;
    const files = this.state.files.map(file => {
      const fileType = file['type'];
      let imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (imageTypes.includes(fileType)) {
        return (
          <li key={file.name} className="file_li">
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
            <br/>
            <img
              src={file.path}
              className="file_img"
            />
          </li>
        )
      } else {
        return (
          <li key={file.name} className="file_li">
            <FileIcon file={file}/>
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
            <div {...getRootProps({ className: 'dropzone upload_file_zone' })}>
              <input {...getInputProps()} />
              {isDragActive ? 'Drop it!' : 'Drag and drop some files here, or click to select files'}
            </div>
            {this.distFile(files)}
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Uploadfile;