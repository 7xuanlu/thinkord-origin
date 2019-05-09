import React, { Component } from 'react'
import TodoItem from './TodoItem';
import PropTypes from 'prop-types';
import { Timeline, TimelineEvent } from "react-event-timeline";



export class Todo extends Component {


    render() {
        // console.log(this.props.todos);
        return (

            this.props.todos.map((todo) => (
                <Timeline>
                    <TimelineEvent
                        style={{
                            width: 600
                        }}
                        title={todo.time}
                    >
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            delTodo={this.props.delTodo}
                            description={todo.description}
                            addDescription={this.props.addDescription} />

                    </TimelineEvent>
                </Timeline>

            ))
        )
    }
}

Todo.propTypes = {
    todos: PropTypes.array.isRequired
}

export default Todo
