import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { ipcRenderer } from 'electron';
import { JSONManager } from '../renderer/json-manager'
import { notePath } from '../components/ControlBarMain'

import './css/Timeline.css';

const jsonmanager = new JSONManager();

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: {},
      saveSign: false
    }
  }

  componentDidMount() {
    ipcRenderer.send('initialize-note');

    ipcRenderer.on('sync-with-note', (event, note) => {
      this.setState({
        timeline: note
      });
    });

    // when you press stop recording, the save button will show up
    ipcRenderer.on('savebutton', () => {
      console.log('I want to save the action I did')
      this.setState({
        saveSign: true
      })
      console.log(this.state.saveSign)
    })

  }



  // Delete the block you choose (frontend)
  delBlock = (time) => {
    console.log('Now you choose the block', time);
    this.setState({
      timeline: { blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)] }
    })
  }

  // Add description (frontend)
  addDescription = (des, time) => {
    let note = this.state.timeline.blocks;

    note.map((block) => {
      // assign the description to the block you point
      if (block.timestamp === time) {
        block.description = des
      }
    })
    this.setState({
      timeline: {
        blocks: note
      }
    })
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

  // Write the data model to the json file
  saveChange = () => {
    jsonmanager.writeJSON(this.state.timeline, notePath)
  }

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    // progressBar animation
    window.onscroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      let h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrolled = (winScroll / h) * 100;
      document.getElementById("progress_bar").style.height = scrolled + "%";
    }
    // console.log(this.state.timeline) // the data model of the timeline
    return (
      <div className="App">
        {this.state.saveSign && <button onClick={this.saveChange}>save</button>}

        <Header />

        <div className="progressContainer">
          <div className="progressBar" id="progress_bar"></div>
        </div>

        <Block
          blocks={this.state.timeline.blocks}
          delBlock={this.delBlock}
          addDescription={this.addDescription}
          addFile={this.addFile}
        />
        <div className="navigationBar">
          <a className="nav_menu" href="#"><i className="fas fa-bars"></i></a>
          <input type="text" className="search_bar" />
          <a className="search" href="#"><i className="fas fa-search"></i></a>
          <a className="up" href="#"><i className="fas fa-angle-up"></i></a>
          <a className="edit" href="#"><i className="fas fa-pen"></i></a>
          <a className="nav_close" href="#"><i className="fas fa-times"></i></a>
        </div>

      </div>
    )
  }
}

export default Timeline;