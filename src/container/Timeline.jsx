import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Progressbar from "../components/layout/Progressbar";
import { ipcRenderer } from "electron";
import './css/Timeline.css';

class Timeline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App" id="App">
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
