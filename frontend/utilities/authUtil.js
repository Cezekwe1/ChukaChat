import axios from 'axios'
import {API_URL} from "./config"

export const login = (username, password) => {
    let h = new Headers();
    return axios.post( `${API_URL}/auth/signin/`, {username,password})
}

export const getMe = () =>{
    
    return axios.get(`${API_URL}/api/users/me?access_token=${localStorage.getItem('token')}`)
}

export const signup = (username, password) => {
    return axios.post( `${API_URL}/api/users/`, {username,password})
}

export const logout = () =>{
    return axios.post(`${API_URL}/users/auth/logout/`,{},{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const changeCurrentOrg = (id) =>{
    return axios.post(`${API_URL}/users/change/org`,{org_id: id},{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const addOrg = (data) =>{
    return axios.post(`${API_URL}/orgs/create`,data,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

