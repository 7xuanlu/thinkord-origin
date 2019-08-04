import React, { Component } from 'react'

export class BlockDescription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: props.description,
            formDes: ''
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
            description: this.state.formDes,
        });
        this.props.addDescription(this.state.formDes, this.props.time);
        this.setState({ formDes: '' });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <div>{this.props.handleLinker(this.state.description)}</div>
                <form className="inputContainer descriptionContainer" onSubmit={this.onSubmit} >
                    <label className="inputLabel">
                        <input
                            name="formDes"
                            className="inputField descriptionInput"
                            type="text"
                            autoComplete="off"
                            placeholder="Describe something ..."
                            value={this.state.formDes}
                            onChange={this.onChange}
                        />
                        <span className="inputSpan"><span className="inputSpan"></span></span>
                    </label>
                </form>
                <br></br>
            </div>
        )
    }
}
export default BlockDescription