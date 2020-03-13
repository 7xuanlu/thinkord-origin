import React, { Component } from 'react'
import { ipcRenderer } from 'electron';

export class BlockDescription extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            whileInput: false // state that detect if user is inputting right now
        }
    }

    componentDidMount() {
        this.setState({
            description: this.props.description
        });
    }

    // When user click the description, it would allow user to modify the content 
    handleClick = () => {
        this.setState({
            whileInput: true
        });
    }

    // When the description lose its focus, user is not allowed to modify
    handleBlur = (e) => {
        e.preventDefault();
        this.setState({
            whileInput: false
        });
    }

    // Save the content of description(frontend)
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Sync the modified content to collection
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
            if(this.state.description === ''){
                des = <div>Describe something...</div>
            }else{
                des = <div>{this.props.handleLinker(this.props.description)}</div>
            }
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
                        autoFocus
                    />
                </form>
        }

        return (
            <div className="inputContainer" onClick={this.handleClick} onBlur={this.handleBlur}>
                {des}
            </div>
        )
    }
}
export default BlockDescription;