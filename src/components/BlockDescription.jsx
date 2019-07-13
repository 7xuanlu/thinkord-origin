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
                <form onSubmit={this.onSubmit} >
                    <input 
                    type="text" 
                    name="description" 
                    className="description" 
                    required autocomplete="off"                             
                    value={this.state.description}
                    onChange={this.onChange}/>

                    <label className="dcp">
                        <span>Descript something ...</span>
                    </label>

                        {/* <input
                            type="text"
                            name="description"
                            // placeholder="Descript something ..."
                            value={this.state.description}
                            onChange={this.onChange}
                        /> */}

                    <input
                        type="hidden"
                        value="comment"
                        className="btn"/>
                </form>
        )
    }
}
export default BlockDescription