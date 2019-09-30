import React, { Component } from 'react'
import { Route, Redirect, Switch, Link, HashRouter } from "react-router-dom";
import Home from '../home/homeContainer'
import LoginSignUpContainer from '../auth/loginSignupContainer'

export class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <NonPrivateRoute exact path="/" component={Home} isAuthenticated={this.props.isAuthenticated}/>
                    <NonPrivateRoute path="/login" component={LoginSignUpContainer} isAuthenticated={this.props.isAuthenticated}/>
                    <NonPrivateRoute path="/signup" component={LoginSignUpContainer} isAuthenticated={this.props.isAuthenticated}/>
                </Switch>
            </div>
        )
    }
}

export default App
