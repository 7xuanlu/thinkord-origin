import React, { Component } from 'react'

export class AddTodo extends Component {
    state = {
        title: '',
        time: '',
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.addTodo(this.state.title, this.getInstantTime());   // pass it to the App component
        this.setState({ title: '' })    // reset the AddTodo State
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    getInstantTime = () => {
        let timestamp = new Date();
        let time = timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + ' '
            + timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();
        return time;
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
                <input
                    type="text"
                    name="title"
                    style={{ flex: 10, padding: '5px' }}
                    placeholder="Add Todo ..."
                    value={this.state.title}
                    onChange={this.onChange}

                />
                <input
                    type="submit"
                    value="Submit"
                    className="btn"
                    style={{ flex: 1 }}
                />
            </form>
        )
    }
}

export default AddTodo
