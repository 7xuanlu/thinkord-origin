import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from "../components/layout/Navigationbar";
import { ipcRenderer } from 'electron';
import { JSONManager } from '../renderer/json-manager'

import './css/Timeline.css';

const jsonmanager = new JSONManager();

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: {},
      notePath: "",
      saveSign: false
    }
  }

  componentDidMount() {
    ipcRenderer.send('init-timeline');

    ipcRenderer.on('sync-with-note', (event, args) => {
      this.setState({
        notePath: args.notePath,
        timeline: args.timeline
      });
    });

    // when you press stop recording, the save button will show up
    ipcRenderer.on('savebutton', () => {
      console.log('I want to save the action I did');
      this.setState({
        saveSign: true
      });
      console.log(this.state.saveSign);
    })
  }

  // Delete the block you choose (frontend)
  delBlock = (time) => {
    console.log('Now you choose the block', time);
    this.setState({
      timeline: { blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)] }
    });
  }

  // Add description (frontend)
  addDescription = (des, time) => {
    let note = this.state.timeline.blocks;

    note.map((block) => {
      // assign the description to the block you point
      if (block.timestamp === time) {
        block.description = des
      }
    });

    this.setState({
      timeline: {
        blocks: note
      }
    });
  }

  handleTitle = (title, time) => {
    let note = this.state.timeline.blocks;

    note.map((block) => {
      // assign the description to the block you point
      if (block.timestamp === time) {
        block.title = title
      }
    });

    this.setState({
      timeline: {
        blocks: note
      }
    });
  }


  // Add file (frontend)
  addFile = (files, time) => {
    let note = this.state.timeline.blocks;
    note.map((block) => {
      if (block.timestamp === time) {
        files.map((file) => {
          if (block.paths.includes(file.path)) {
            return;
          }
          block.paths.push(file.path)
        })
      }
    })
    this.setState({
      timeline: {
        blocks: note
      }
    })
  }

  // Delete file (frontend)
  delFile = (files, time) => {
    let note = this.state.timeline.blocks;
    note.map((block) => {
      if (block.timestamp === time) {

        block.paths.splice(1)
        files.map((file) => {
          block.paths.push(file.path)
        })
      }
    })
    // console.log(note);
  }

  // Write the data model to the json file
  saveChange = () => {
    jsonmanager.writeJSON(this.state.timeline, this.state.notePath)
  }

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    // console.log(this.state.timeline) // the data model of the timeline
    return (
      <div className="App" id="App">
        {this.state.saveSign && <button onClick={this.saveChange}>save</button>}
        <Sidebar />
        <Navigationbar />
        <div className="content" id="content">
          <Header />
          <Progressbar />
          <Block
            blocks={this.state.timeline.blocks}
            delBlock={this.delBlock}
            addDescription={this.addDescription}
            delFile={this.delFile}
            addFile={this.addFile}
            onChangeTitle={this.handleTitle}
          />
        </div>
      </div>
    )
  }
}

export default Timeline;