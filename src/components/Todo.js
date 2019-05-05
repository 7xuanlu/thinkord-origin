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
                            width: 850
                        }}
                        title={todo.time}
                        container="card"
                        cardHeaderStyle={{
                            backgroundColor: '#007799',
                            color: '#FFFFFF',
                            height: 15
                        }}
                    >
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            markComplete={this.props.markComplete}
                            delTodo={this.props.delTodo} />
                           
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
