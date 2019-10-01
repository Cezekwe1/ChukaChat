import React, { Component } from 'react'
import { Route, Redirect, Switch, Link, HashRouter } from "react-router-dom";
import Home from '../home/homeContainer'
import LoginSignUpContainer from '../auth/loginSignupContainer'
import NonPrivateRoute from '../../utilities/nonPrivateRoute'
import PrivateRoute from '../../utilities/privateRoute'
import ProfileContainer from '../profile/profileContainer'
import Nav from '../nav/navBarContainer'
export class App extends Component {
    componentWillMount() {
        this.props.checkAuthState();
    }
    showNavBar() {
        var nav;
    
        if (this.props.isAuthenticated) {
          nav = <Nav history={this.props.history}/>;
        } else {
          nav = "";
        }
        return nav;
    }
    
    render() {
        var nav = this.showNavBar();
        return (
            
            <div>
                {nav}
                <Switch>
                    <NonPrivateRoute exact path="/" component={Home} isAuthenticated={this.props.isAuthenticated}/>
                    <NonPrivateRoute path="/login" component={LoginSignUpContainer} isAuthenticated={this.props.isAuthenticated}/>
                    <NonPrivateRoute path="/signup" component={LoginSignUpContainer} isAuthenticated={this.props.isAuthenticated}/>
                    <PrivateRoute path="/profile" component={ProfileContainer} isAuthenticated={this.props.isAuthenticated}/>
                </Switch>
            </div>
        )
    }
}

export default App
