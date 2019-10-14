import axios from 'axios'
import {API_URL} from "./config"
export const getNotifications = () =>{
    return axios.get(`${API_URL}/api/invites/?access_token=${localStorage.getItem("token")}`,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const respondOrgInvite = (data) =>{
    return axios.post(`${API_URL}/users/invite/accept/org`,data,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const respondFriendRequest = (data) =>{
    return axios.put(`${API_URL}/api/invites/${data.id}?access_token=${localStorage.getItem("token")}`,data,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const removeFriendNotifications = (data) =>{
    return axios.post(`${API_URL}/users/invite/remove/friend`,data,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}

export const removeOrgNotifications = (data) =>{
    return axios.post(`${API_URL}/users/invite/remove/org`,data,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}