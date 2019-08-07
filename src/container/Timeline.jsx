import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from "../components/layout/Navigationbar";
import './css/Timeline.css';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ipcRenderer } from "electron";

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveSign: true,
      note_title: ''
    }
  }

  componentDidMount() {
    // When you press stop recording, then you could save slu
    ipcRenderer.on('savebutton', () => {
      this.setState({
        saveSign: !this.state.saveSign
      })
    })

    // When you press start recording, the you could not save slu
    ipcRenderer.on('hidesavebutton', () => {
      this.setState({
        saveSign: !this.state.saveSign
      });
    });
  }

  // go to Mainwindow
  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  // Write the data model to the json file
  saveChange = () => {
    ipcRenderer.send('Navbar-save-slu')
  }

  scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  render() {
    return (
      <BlockUi tag="div" blocking={!this.state.saveSign}>
        <div className="App" id="App">
          <div className="pageContent" id="content">
            <Header title={this.state.note_title} />
            <div><Progressbar /></div>
            <BlockContainer
              onNewBlock={this.scrollToBottom}
            />
            <Navigationbar
              clickHome={this.returnToMain}
              clickSave={this.state.saveSign && this.saveChange}
            />
          </div>
        </div>
      </BlockUi>
    )
  }
}

export default Timeline;
