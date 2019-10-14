import { combineReducers } from 'redux'
import auth from './authReducer'
import search from './searchReducer'
import notifications from './notificationsReducer'
import profile from './profileReducer'
import chat from './chatReducer'
export default combineReducers({
    auth,
    search,
    notifications,
    profile,
    chat
})