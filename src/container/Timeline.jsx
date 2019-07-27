import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from "../components/layout/Navigationbar";
import { ipcRenderer } from "electron";
import './css/Timeline.css';

class Timeline extends Component {
  constructor() {
    super();
  }

  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  render() {

    return (
      <div className="App" id="App">

        {/* <button onClick={this.returnToMain}>Return main</button> */}

        <Sidebar />
        <Navigationbar clickHome={this.returnToMain}/>
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
