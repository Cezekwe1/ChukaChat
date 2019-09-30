import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom';
import * as auth from '../../utilities/auth_util.js'
import { thisExpression } from '@babel/types';
export default class LoginSignup extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            email: ''
        }
        

    }

    update(field){
        return e => this.setState({
            [field] : e.currentTarget.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const user = Object.assign({},this.state)
       
        this.props.process(user)
    } 

    componentWillReceiveProps(newProps){
        if ((newProps.auth.errors != null)&& (this.props.formType == newProps.formType)){
            alert("invalid Credentials")
        }else if ((newProps.auth.errors == null) && newProps.auth.token != null){
            this.props.history.push("/tasks")
        }
    }


    
    getLinks = () =>{
        let emailTop, bottomLink;
        if(this.props.formType == 'signup'){
            emailTop = <div className="form-group"> 
            <label className="mr-2" htmlFor="email">Email</label>
            <input className="form-control" onChange={this.update("email")}type="text" name="email" placeholder="email"/>
            </div>
            bottomLink = <span>Already have an account <Link to='/login'>Login</Link></span>
        }else{
            emailTop = ''
            bottomLink = <span>Dont have an account? <Link to='/signup'>Sign Up</Link></span>
        }
        return {emailTop, bottomLink}
    }

    render() {
        const {emailTop , bottomLink} = this.getLinks()
        return (
            <div className="h-100">
                <div className="row align-items-center h-100 justify-content-center">
                    <form onSubmit={this.handleSubmit} className="bg-light card border col-4 p-4">
                        <h2 className="text-center mb-2">{(this.props.formType == "login")? "Login" : "Signup" }</h2>
                        {emailTop}
                        <div className="form-group">
                            <label className="mr-2" htmlFor="username"> Username </label>
                            <input className="form-control" onChange={this.update("username")}type="text" name="username" placeholder="username"/>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password"> Password </label>
                            <input  className="form-control" onChange={this.update("password")}type="password" name="" id="" placeholder="password"/>
                        </div>
                        <input  className="btn btn-primary mb-2" type="submit" />
                        {bottomLink}
                    </form>
                </div>
            </div>
        )
    }
}
