import {GET_ALL_MESSAGES_SUCCESS,SEND_MESSAGE_SUCCESS, SET_CURRENT_CONVO, CLEAR_CONVO} from '../actions/types'

const intialState = {
    messages: [],
    currentConvo: null
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
        case SET_CURRENT_CONVO:
                return {
                    ...state,
                    currentConvo: action.payload,
                    messages: (action.payload == null) ? [] : state.messages
                }
        case CLEAR_CONVO:
            return intialState
        default:
            return state
    }
}