import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import Image from 'react-image-resizer';
import { shell } from 'electron';


export class UploadFile extends Component{
    constructor(props) {
        super(props);
        this.state = {
          file: '',
          filePath: '',
          imagePreviewUrl: ''
        };
        this.handleImageChange = this.handleImageChange.bind(this);
        this.OpenFileButton = this.OpenFileButton.bind(this);
    }
    handleImageChange(e) {
        e.preventDefault();
        const reader = new FileReader()
        const file = e.target.files[0]
        const filePath = e.target.files[0].path

        reader.onloadend = () => {
          this.setState({
            file: file,
            filePath: filePath,
            imagePreviewUrl: reader.result
          });
        }
        if(file){
          reader.readAsDataURL(file)
        }
    }
    OpenFileButton(e){
        const fileBtn = document.getElementById('fileBtn');
        if(fileBtn){
            console.log("catch you")
            shell.openItem(this.state.filePath)
        }
    }
    render() {
        let {imagePreviewUrl, file} = this.state;
        let fileType = file['type'];
        let imageTypes = ['image/gif','image/jpeg','image/png'];
        let image = null;

        

        if(file === ''){
          console.log('nothing')
          image = null
        }else if(imageTypes.includes(fileType)){
          image = <Image 
                    src = {imagePreviewUrl}
                    width={600}
                    height={400}
                  />
        }else{
          image = <Button 
                    id="fileBtn"
                    size="sm"
                    onClick={this.OpenFileButton}
                  >open</Button>
        }
    
         
        return (
    
          <div>
            <input className="fileInput" type="file"  onChange={this.handleImageChange} />
            {image}
          </div>
        )
      }
}

export default UploadFile