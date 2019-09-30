import React, { Component } from 'react'

export class Home extends Component {
    render() {
        return (
            <div className="home-screen">
                <div className="random-class mt-2">
                    <button className="btn mr-2 btn-primary">Sign In</button>
                    <button className="btn mr-2 btn-primary">Sign Up</button>
                </div>

                <div className="mt-2">
                    <button className="btn btn-outline-success ml-2 mr-2 btn-lg">Sign In Guest 1</button>
                    <button className="btn btn-outline-success btn-lg">Sign In Guest 2</button>
                </div>
            </div>
        )
    }
}

export default Home
