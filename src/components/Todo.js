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
                            width: 700
                        }}
                        title={todo.time}
                        // container="card"
                        // cardHeaderStyle={{
                        //     backgroundColor: '#007799',
                        //     color: '#FFFFFF',
                        //     height: 15
                        // }}
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
