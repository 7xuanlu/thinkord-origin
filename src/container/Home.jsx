import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { read } from "../renderer_process/fetch-data";
import './css/style.css';
import './css/Home.css'


class Home extends Component {
  state = {
    timeline: {

    }
  }

  componentWillMount() {
    read().then((blockdata) => {
      this.setState({
        timeline: blockdata
      })
    })
  }

  // Delete Todo
  // delTodo = (id) => {
  //   // console.log(id)
  //   this.setState({
  //     todos: [...this.state.todos.filter(todo => todo.id !== id)]
  //   })
  // }

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
   
    // shield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    return (
      <div className="App">
        <div className="container">
          <Header />
          <Block 
            blocks={this.state.timeline.blocks}
          />
        </div>
      </div>
    );
  }

}

export default Home;

