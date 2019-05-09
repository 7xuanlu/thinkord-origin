import React, { Component } from 'react'
import PropTypes from 'prop-types';
import AddDescription from './AddDescription';

/**************************************************************************************/


/**************************************************************************************/


export class TodoItem extends Component {

    getStyle = () => {
        return {
            bakground: '#f4f4f4',
            padding: '10px'
        }
    }


    render() {
        console.log(this.props)
        const { id, title, description } = this.props.todo;
        return (

            <div style={this.getStyle()}>
                <div>
                    <h1>{title}</h1>
                    <br></br>
                    <br></br>
                    <div>
                        <p>{description}</p>
                    </div>

                    <button onClick={this.props.delTodo.bind(this, id)}
                        style={btnStyle}
                        size="small">delete</button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <AddDescription
                        addDescription={this.props.addDescription}
                        id={id}
                        title={title}
                    />
                </div>
            </div>


        )
    }
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
}

const btnStyle = {
    background: '#AAAAAA',
    color: '#fff',
    border: '1px',
    padding: '2px 4px',
    borderRadius: '8%',
    cursor: 'pointer',
    float: 'right'
}


export default TodoItem
