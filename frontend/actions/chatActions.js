import {GET_ALL_MESSAGES_SUCCESS, SEND_MESSAGE_SUCCESS, MAKE_CONVO_SUCCESS} from './types'
import * as ChatUtil from '../utilities/chatUtil'
import * as AuthActions from './authActions'

const makeConvoSuccess = (payload) =>({
    type: MAKE_CONVO_SUCCESS,
    payload
})


const getAllMessagesSuccess = (payload) =>({
    type: GET_ALL_MESSAGES_SUCCESS,
    payload
})

export const sendMessageSuccess = (payload) =>({
    type: SEND_MESSAGE_SUCCESS,
    payload
})


export const makeConversation = (id) => dispatch => {
    return ChatUtil.makeAConversation(id).then(function(res){
        dispatch(makeConvoSuccess(res.data))
    }).catch(err => dispatch(AuthActions.logout()))
}

export const getAllMessages = (id) => dispatch => {
    return ChatUtil.getAllConvoMessages(id).then(function(res){
        
        dispatch(getAllMessagesSuccess(res.data))
    }).catch(err => dispatch(AuthActions.logout()))
}

export const sendMessage = (data) => dispatch =>{
    return ChatUtil.sendMessage(data).then((res) =>
        dispatch(sendMessageSuccess(res.data))
    ).catch(err => dispatch(AuthActions.logout()))
}

