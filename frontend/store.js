import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers';


const initialState = {}
const middleware = [thunk]
const user = window.localStorage.getItem('user')
const token = window.localStorage.getItem("token")
const friends = JSON.parse(window.localStorage.getItem("friends")) || []
const conversations = JSON.parse(window.localStorage.getItem("conversations")) || []


initialState["auth"] = {
    token,
    user,
    friends,
    conversations
}
const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))
export default store