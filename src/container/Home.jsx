import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { JSONManager } from "../renderer/json-manager";

import './css/style.css';
import './css/Home.css'
import { ipcRenderer } from 'electron';

const jsonManager = new JSONManager();

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: {}
    }
  }

  componentDidMount() {
    ipcRenderer.on('sync-with-note', (event, note) => {
      this.setState({
        timeline: note
      });
      console.log(this.state.timeline);
    });
  }

  // Delete Todo
  delTodo = (time) => {
    console.log('Now you choose the block', time);
    this.setState({
      timeline: { blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)] }
    })
  }

  // Add Description
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

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    return (
      <div className="App">
        <div className="container">
          <Header />
          <Block
            blocks={this.state.timeline.blocks}
            delTodo={this.delTodo}
            addDescription={this.addDescription}
          />
        </div>
      </div>
    )
  }
}

export default Home;