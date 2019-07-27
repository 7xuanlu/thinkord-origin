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
                    <input 
                        name="description"
                        className="inputField descriptionInput"
                        type="text"
                        autoComplete="off"
                        value={this.state.description}
                        onChange={this.onChange}
                    />
                    <label for="Description"><span>Descript something ...</span></label>
                    <input
                        type="hidden"
                        value="comment"/>
            </form>

            // <form onSubmit={this.onSubmit} >
            //     <input
            //         type="text"
            //         name="description"
            //         className="description"
            //         required autoComplete="off"
            //         value={this.state.description}
            //         onChange={this.onChange} />

            //     <label className="dcp">
            //         <span>Descript something ...</span>
            //     </label>

            //     <input
            //         type="hidden"
            //         value="comment"/>
            // </form>
        )
    }
}
export default BlockDescription