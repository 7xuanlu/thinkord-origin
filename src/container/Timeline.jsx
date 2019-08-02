import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from "../components/layout/Navigationbar";
import { ipcRenderer } from "electron";
import './css/Timeline.css';

class Timeline extends Component {
  constructor(props) {
    super(props);
  }

  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  render() {
    return (
      <div className="App" id="App">
        <Sidebar />
        <Navigationbar clickHome={this.returnToMain} />
        <div className="pageContent" id="content">
          <Header />
          <div><Progressbar /></div>
          <BlockContainer />
        </div>
      </div>
    )
  }
}

export default Timeline;
