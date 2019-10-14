import axios from 'axios'
import {API_URL} from "./config"
export const getAllConvoMessages = (id) =>(
    axios.get(`${API_URL}/api/messages/convo/${id}?access_token=${localStorage.getItem('token')}`)
)

export const makeAConversation = (id) =>(
    axios.post(`${API_URL}/api/conversations/?access_token=${localStorage.getItem('token')}`,{target: id})
)

export const sendMessage = ({receiver,text,conversation}) =>(
    axios.post(`${API_URL}/api/messages/?access_token=${localStorage.getItem('token')}`, {receiver,text,conversation})
)

