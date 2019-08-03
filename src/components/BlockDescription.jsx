import React, { Component } from 'react'

export class BlockDescription extends Component {

    state = {
        description: ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.addDescription(this.state.description, this.props.time);
        this.setState({
            description: ''
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        return (
            <form className="inputContainer descriptionContainer" onSubmit={this.onSubmit} >
                <label className="inputLabel">
                    <input 
                            name="description"
                            className="inputField descriptionInput"
                            type="text"
                            placeholder="Describe something ..."
                            autoComplete="off"
                            value={this.state.description}
                            onChange={this.onChange}
                        />
                    <span className="inputSpan"><span className="inputSpan"></span></span>
                    </label>
            </form>
        )
    }
}
export default BlockDescription