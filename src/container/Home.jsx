import React, { Component } from 'react'
import './Home.css';
import Todo from "../components/Todo";
import AddTodo from "../components/AddTodo";
import Header from "../components/layout/Header";
import uuid from "uuid";
import '../components/css/style.css';

class App extends Component {
  state = {
    todos: [
      // {
      //   id: uuid.v4(),
      //   title: 'Take out the trash',
      //   description:''
      // }
    ]
  }

  // Delete Todo
  delTodo = (id) => {
    // console.log(id)
    this.setState({
      todos: [...this.state.todos.filter(todo => todo.id !== id)]
    })
  }

  // Add Todo
  addTodo = (title, time) => {
    // console.log(title);
    // console.log(time)
    const newTodo = {
      id: uuid.v4(),
      title: title,
      time: time,
    }
    this.setState({ todos: [...this.state.todos, newTodo] })
  }

  // Add Description
  addDescription = (des, id) => {
    let data = this.state.todos;
    this.state.todos.map((todo, index) => {
      console.log(todo, index);
      if (todo.id === id) {
        data[index].description = des;
      }
    })
    this.setState({
      todos: data
    })
  }

  componentDidMount(){
    console.log('fuck')
  }


  render() {
    // console.log(this.state.todos);
    return (
      <div className="App">
        <div className="container">
          <Header />
          <AddTodo addTodo={this.addTodo} />
          <Todo
            todos={this.state.todos}
            delTodo={this.delTodo}
            addDescription={this.addDescription}
          />
        </div>
      </div>
    );
  }

}

export default App;

