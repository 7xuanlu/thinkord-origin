import React, { Component } from 'react';
import './App.css';
import Todo from './components/Todo';
import AddTodo from "./components/AddTodo";
import Header from "./components/layout/Header";
import uuid from 'uuid';

class App extends Component {
  state = {
    todos: [
      // {
      //   id: uuid.v4(),
      //   title: 'Take out the trash',
      //   completed: false
      // },
      // {
      //   id: uuid.v4(),
      //   title: 'Dinner with wife',
      //   completed: false
      // },
      // {
      //   id: uuid.v4(),
      //   title: 'Meeting with boss',
      //   completed: false
      // }
    ]
  }


  // Toggle complete
  markComplete = (id) => {
    // console.log(id)
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    })
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
    console.log(title);
    console.log(time)
    const newTodo = {
      id: uuid.v4(),
      title: title,
      time: time,
      completed: false
    }
    this.setState({ todos: [...this.state.todos, newTodo] })
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
            markComplete={this.markComplete}
            delTodo={this.delTodo}
          />


        </div>
      </div>
    );
  }

}

export default App;
