import React, { Component } from 'react'

export class BlockDescription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            whileInput: false
        }
    }

    componentDidMount() {
        if (this.props.description !== "") {
            this.setState({
                description: this.props.description
            });
        }
    }

    handleDoubleClick = () => {
        this.setState({
            whileInput: true
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addDescription(this.state.description, this.props.time);
        this.setState({
            whileInput: false
        });
    }

    render() {
        let des;
        if (this.state.whileInput === false) {
            des = <div onDoubleClick={this.handleDoubleClick}> {this.props.handleLinker(this.state.description)} </div>
        } else {
            des =
                <form onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        name="description"
                        className="inputField"
                        autoComplete="off"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                </form>
        }

        return (
            <div className="inputContainer descriptionContainer">
                {des}
            </div>
        )
    }
}
export default BlockDescription;