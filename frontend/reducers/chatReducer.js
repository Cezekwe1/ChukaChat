import {GET_ALL_MESSAGES_SUCCESS,SEND_MESSAGE_SUCCESS} from '../actions/types'

const intialState = {
    messages: []
}

export default function(state = intialState, action){
    switch(action.type){
        case GET_ALL_MESSAGES_SUCCESS:
            return {
                ...state,
                messages: action.payload
            }
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        default:
            return state
    }
}