import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from '../components/layout/Navigationbar';
import './css/Timeline.css';

import { ipcRenderer } from "electron";

// Third-party packages
// This is to block UI interaction while user adding blocks to timeline
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

// Renderer shortcut
const Mousetrap = require('mousetrap');

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveSign: true,
      sluTitle: ''
    }
  }

  componentDidMount() {
    ipcRenderer.once('init-slu-title', (event, title) => {
      this.setState({ sluTitle: title });
    });

    // When you press stop recording, then you could save slu
    ipcRenderer.on('savebutton', () => {
      this.setState({ saveSign: !this.state.saveSign });
    });

    // When you press start recording, the you could not save slu
    ipcRenderer.on('hidesavebutton', () => {
      this.setState({ saveSign: !this.state.saveSign });
    });

    // With Mousetrap package, you should specify "Ctrl" as "ctrl"
    Mousetrap.bind(['ctrl+s', 'ctrl+S'], () => {
      this.saveChange();
    });

    Mousetrap.bind(['ctrl+z', 'ctrl+Z'], () => {
      ipcRenderer.send('pre-step-click');
    });

    Mousetrap.bind(['ctrl+y', 'ctrl+Y'], () => {
      ipcRenderer.send('next-step-click');
    });
  }

  // Return to Mainwindow
  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  // Write data to the json file
  saveChange = () => {
    ipcRenderer.send('navbar-save-slu');
  }

  scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  handleClickPreviousStep = () => {
    ipcRenderer.send('pre-step-click');
  }

  handleClickNextStep = () => {
    ipcRenderer.send('next-step-click');
  }

  handleTitle = (title) => {
    if (title === '') {
      return;
    } else {
      this.setState({ sluTitle: title });
    }
  }

  render() {
    return (
      <BlockUi tag="div" blocking={!this.state.saveSign
      } >
        <div className="App" id="App">
          <div className="pageContent" id="content">
            <Header title={this.state.sluTitle} handleTitle={this.handleTitle} />
            <div><Progressbar /></div>
            <BlockContainer
              onNewBlock={this.scrollToBottom}
              ReturnToTop={this.scrollToTop}
              clickHome={this.returnToMain}
              clickSave={this.state.saveSign && this.saveChange}
              title={this.state.sluTitle}
            />
            <Navigationbar
              clickPreviousStep={this.handleClickPreviousStep}
              clickNextStep={this.handleClickNextStep}
              clickSave={this.saveChange}
              clickHome={this.returnToMain}
              clickTop={this.scrollToTop}
              clickBottom={this.scrollToBottom}
            />
          </div>
        </div>
      </BlockUi >
    )
  }
}

export default Timeline;
