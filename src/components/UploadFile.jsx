import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {Button} from 'react-bootstrap';
import styled from 'styled-components';
import Image from 'react-image-resizer';
import {shell} from 'electron';

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
    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)

      }))
    })
  }
  //for files that are not images.
  OpenFileButton(e){
    const fileBtn = document.getElementById('fileBtn');
    if(fileBtn){
        console.log("catch you")
        shell.openItem("路徑")
    }
  }


  render(){
    
    const getColor = (props) => {
      return '#00e676';
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
      let imageTypes = ['image/gif','image/jpeg','image/png'];
      if(imageTypes.includes(fileType)){
        return(
          <div>
            <li key={file.name}>
              {file.name}
              <br/>
              <Image 
                src = {file.preview}
                width={600}
                height={400}
              />
            </li>
          </div>
        )
      }else{
        return(
          <div>
            <li key={file.name}>
              {file.name}
              <br/>
            <Button
              id="fileBtn"
              size='sm'
              onClick={this.OpenFileButton}
            >open!</Button>  
            </li>
          </div>
        )
      }
    })

    return (
      <Dropzone onDrop={this.onDrop.bind(this)}>
        {({getRootProps, getInputProps}) => (
          <div className="container">
            <Container {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
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