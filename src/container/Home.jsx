import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { NoteManager } from "../renderer/note-manager";
import { notePath } from "../components/ControlBarMain";

import './css/style.css';
import './css/Home.css'

const noteManager = new NoteManager();

class Home extends Component {
  state = {
    timeline: {

    }
  }

  componentWillMount() {
    noteManager.getNoteJSON(notePath).then((blockdata) => {
      // console.log(blockdata)
      this.setState({
        timeline: blockdata
      })
    })
  }

  // Delete Todo
  delTodo = (time) => {
    // console.log(id)
    // this.setState({
    //   todos: [...this.state.timeline.blocks.filter(todo => todo.id !== id)]
    // })
    // this.setState({
    //   timeline: { blocks: [] }
    // })
    console.log('shut the fuck up',time);
    this.setState({
      timeline:{blocks:[...this.state.timeline.blocks.filter(block=> block.timestamp !== time)]}
    })
  }

  // Add Description
  // addDescription = (des, id) => {
  //   let data = this.state.todos;
  //   this.state.todos.map((todo, index) => {
  //     console.log(todo, index);
  //     if (todo.id === id) {
  //       data[index].description = des;
  //     }
  //   })
  //   this.setState({
  //     todos: data
  //   })
  // }

  render() {
    console.log(this.state.timeline.blocks)
    // shield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    return (
      <div className="App">
        <div className="container">
          <Header />
          <Block
            blocks={this.state.timeline.blocks}
            delTodo={this.delTodo} />
        </div>
      </div>
    )

  }

}

export default Home;

