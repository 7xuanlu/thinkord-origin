import React, { Component } from 'react'
import PropTypes from 'prop-types';
import AddDescription from './AddDescription';

/**************************************************************************************/
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Img from '../asset/anatomy.png';
/**************************************************************************************/



export class TodoItem extends Component {
    render() {

        const { id, title, description, time } = this.props.todo;
        return (

            <Card>
                <Card.Header>{time}</Card.Header>
                <Card.Img variant="top" src={ Img } />
                <Card.Body>

                    <Card.Text>{description}</Card.Text>

                    <AddDescription
                        addDescription={this.props.addDescription}
                        id={id}
                        title={title}
                    />

                    <br></br>
                    <br></br>
                    <input type="file" />
                    <Button onClick={this.props.delTodo.bind(this, id)}
                        style={btnStyle}
                        size="small" variant="primary">delete</Button>

                </Card.Body>

            </Card>
        )
    }
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
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
