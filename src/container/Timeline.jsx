import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from "../components/layout/Navigationbar";
import { ipcRenderer } from "electron";
// import './css/Timeline.css';

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveSign: false
    }
  }

  componentDidMount() {

    // when you press stop recording, the save button will show up
    ipcRenderer.on('savebutton', () => {
      console.log('I want to save the action I did');
      this.setState({
        saveSign: true
      });
      console.log(this.state.saveSign);
    })
  }



  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  render() {

    return (
      <div className="App" id="App">
        {this.state.saveSign && <button onClick={this.saveChange}>save</button>}
        <button onClick={this.returnToMain}>Return main</button>
      
        <Sidebar />
        <Navigationbar />
        <div className="content" id="content">
          <Header />
          <BlockContainer  />
          <Progressbar />
        </div>
      </div>
    )
  }
}

export default Timeline;
