import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { ipcRenderer } from 'electron';
import { NoteManager } from '../renderer/note-manager'
import { JSONManager } from '../renderer/json-manager'
import { notePath } from '../components/ControlBarMain'

const notemanager = new NoteManager();
const jsonmanager = new JSONManager();
let notemodel;
class Home extends Component {
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

    ipcRenderer.on('savebutton', () => {
      console.log('I want to save the action I did')
      this.setState({
        saveSign: true
      })
      console.log(this.state.saveSign)
    })

  }



  // Delete Todo (frontend)
  delTodo = (time) => {
    console.log('Now you choose the block', time);
    this.setState({
      timeline: { blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)] }
    })
    notemodel = notemanager.deleteBlock(this.state.timeline, time)
    // console.log(notemodel)
  }

  // Add Description (frontend)
  addDescription = (des, time) => {
    let data = this.state.timeline.blocks;

    data.map((block) => {
      // assign the description to the block you point
      if (block.timestamp === time) {
        block.description = des
      }
      this.setState({
        timeline: {
          blocks: data
        }
      })
    })
  }

  // Ready to write the data model to the json file
  saveChange = () => {
    // console.log(this.state.timeline)
    jsonmanager.writeJSON(notemodel, notePath)
  }

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    console.log(this.state.timeline) // the data model of the timeline
    return (
      <div className="App">
        {this.state.saveSign && <button onClick={this.saveChange}>save</button>}

        <Header />
        <Block
          blocks={this.state.timeline.blocks}
          delTodo={this.delTodo}
          addDescription={this.addDescription}
        />
      </div>
    )
  }
}

export default Home;