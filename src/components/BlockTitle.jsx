import React, { Component } from 'react'

export default class BlockTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "Title",
            whileInput: false  // state that detect if user is inputting right now
        }
    }

    componentDidMount() {
        if (this.props.title !== "") {
            this.setState({
                title: this.props.title
            })
        }
    }

    handleClick = () => {
        this.setState({
            whileInput: true
        });
    }

    handleBlur = (e) => {
        e.preventDefault();
        this.setState({
            whileInput: false
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onChangeTitle(this.state.title, this.props.time);
        this.setState({
            whileInput: false
        });
    }

    render() {
        let title;
        if (this.state.whileInput === false) {
            title = <div onClick={this.handleClick}> {this.state.title} </div>
        } else {
            title =
                <form onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        name="title"
                        className="inputField titleInput"
                        autoComplete="off"
                        value={this.state.title}
                        onChange={this.handleChange}
                        autoFocus
                    />
                </form>
        }
        return (
            <div className="blockTitle" onBlur={this.handleBlur}>
                {title}
            </div>
        )
    }
}
