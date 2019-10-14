import Trie from "./Trie"
import axios from 'axios'
import {API_URL} from "./config"
export const processMembers = (members) =>{
    var trie = new Trie();
    
    for (let member of members){
        trie.add(member.username, member._id)
    }
    return trie
}

export const search = (str) =>{
    return axios.get(`${API_URL}/api/users/search/${str}?access_token=${localStorage.getItem("token")}`,{headers: {"Authorization": "Token " + localStorage.getItem("token")}})
}



