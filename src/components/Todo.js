import React, { Component } from 'react'
import TodoItem from './TodoItem';
import PropTypes from 'prop-types';
// import { Timeline, TimelineEvent } from "react-event-timeline";
// import './css/style.css'


export class Todo extends Component {

    state = {
        on: true
    }
    // change the show up state
    toggle = () => {

        this.setState({
            on: !this.state.on
        })


    }

    render() {
        console.log(this.props.todos[0])
        return (

            this.props.todos.map((todo, id) => (
                <div id="content">
                    <ul className="timeline">
                        <li className="event" data-date={todo.time}>
                            <div className="member-infos" >
                                <h1 className="member-title" onClick={this.toggle}>Topic</h1>

                                {this.state.on && (
                                    <TodoItem
                                        id={id}
                                        key={todo.id}
                                        todo={todo}
                                        delTodo={this.props.delTodo}
                                        description={todo.description}
                                        addDescription={this.props.addDescription}
                                    />
                                )}



                            </div>
                        </li>
                    </ul>
                </div>

            ))
        )
    }
}

Todo.propTypes = {
    todos: PropTypes.array.isRequired
}

export default Todo
