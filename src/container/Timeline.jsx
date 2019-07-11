import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { ipcRenderer } from 'electron';
import { JSONManager } from '../renderer/json-manager'
import { notePath } from '../components/ControlBarMain'


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

  // Add Description (frontend)
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

  // Write the data model to the json file
  saveChange = () => {
    jsonmanager.writeJSON(this.state.timeline, notePath)
  }

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    // console.log(this.state.timeline) // the data model of the timeline
    return (
      <div className="App">
        {this.state.saveSign && <button onClick={this.saveChange}>save</button>}

        <Header />
        <Block
          blocks={this.state.timeline.blocks}
          delBlock={this.delBlock}
          addDescription={this.addDescription}
        />
      </div>
    )
  }
}

export default Timeline;