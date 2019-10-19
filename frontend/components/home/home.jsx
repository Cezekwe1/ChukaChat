import React, { Component } from 'react'
import {NavLink} from 'react-router-dom';

export class Home extends Component {
    login = (user) =>{
        this.props.login({username: user, password: "test"})
        .then(()=>this.props.history.push("/chat"))
    }
    render() {
        return (
            <div className="home-screen">
                <div className="random-class mt-2">
                    <NavLink to={'login'} className="btn mr-2 btn-primary">Sign In</NavLink>
                    <NavLink to={'signup'} className="btn mr-2 btn-primary">Sign Up</NavLink>
                </div>

                <div className="mt-2">
                    <button onClick={()=>this.login("guest1")} className="btn btn-outline-success ml-2 mr-2 btn-lg">Sign In Guest 1</button>
                    <button onClick={()=>this.login("guest2")} className="btn btn-outline-success btn-lg">Sign In Guest 2</button>
                </div>
            </div>
        )
    }
}

export default Home
