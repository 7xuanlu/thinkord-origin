import React, { Component } from 'react';

export default class Header extends Component{
    constructor(props){
        super(props)

        this.state = {
            title: '',
            whileInput: false
        }
    }

    componentDidMount(){
        this.setState({
            title: this.props.title
        });
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
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleTitleChanged(this.state.title);
        this.setState({
            whileInput: false
        });
    }

    render(){
        let title;
        if (this.state.whileInput === false) {
            title = <div>{this.props.title}</div>
        } else {
            title =
                <form onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        name="title"
                        className="inputField_title"
                        autoComplete="off"
                        defaultValue={this.props.title}
                        onChange={this.handleChange}
                        autoFocus
                    />
                </form>
        }

        return (
            <header>
                <h1 className="file-title">
                    <div onClick={this.handleClick} onBlur={this.handleBlur}>
                        {title}
                    </div>
                </h1>
            </header>
        )
    }
}
