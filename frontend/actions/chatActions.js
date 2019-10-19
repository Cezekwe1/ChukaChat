import {
  GET_ALL_MESSAGES_SUCCESS,
  SEND_MESSAGE_SUCCESS,
  MAKE_CONVO_SUCCESS,
  SET_CURRENT_CONVO,
  CLEAR_CONVO
} from "./types";
import * as ChatUtil from "../utilities/chatUtil";
import * as AuthActions from "./authActions";

const makeConvoSuccess = payload => ({
  type: MAKE_CONVO_SUCCESS,
  payload
});

const getAllMessagesSuccess = payload => ({
  type: GET_ALL_MESSAGES_SUCCESS,
  payload
});

const setCurrentConvoAction = payload => ({
  type: SET_CURRENT_CONVO,
  payload
});

const clearConvoAction = () => ({
  type: CLEAR_CONVO
});

export const sendMessageSuccess = payload => ({
  type: SEND_MESSAGE_SUCCESS,
  payload
});

export const setCurrentConvo = convo => dispatch => {
  localStorage.setItem("currentConvo", JSON.stringify(convo));
  dispatch(setCurrentConvoAction(convo));
};

export const checkCurrentConvo = () => dispatch => {
  let currentConvo = JSON.parse(localStorage.getItem("currentConvo"));
  dispatch(setCurrentConvoAction(currentConvo));
};

export const clearConvo = () => dispatch => {
  localStorage.removeItem("currentConvo");
  dispatch(clearConvoAction());
};

export const makeConversation = id => dispatch => {
  return ChatUtil.makeAConversation(id)
    .then(function(res) {
      if (res.data) {
        let conversations = JSON.parse(localStorage.getItem("conversations"));
        conversations.push(res.data);
        localStorage.setItem("conversations", JSON.stringify(conversations));
        dispatch(makeConvoSuccess(res.data));
      }
    })
    .catch(err => dispatch(AuthActions.logout()));
};
export const deleteConversation = id => dispatch => {
  return ChatUtil.deleteConversation(id)
    .then(function(res) {
      dispatch(AuthActions.getMe());
    })
    .catch(err => dispatch(AuthActions.logout()));
};

export const getAllMessages = id => dispatch => {
  return ChatUtil.getAllConvoMessages(id)
    .then(function(res) {
      dispatch(getAllMessagesSuccess(res.data));
    })
    .catch(err => dispatch(AuthActions.logout()));
};

export const sendMessage = data => dispatch => {
  return ChatUtil.sendMessage(data)
    .then(res => dispatch(sendMessageSuccess(res.data)))
    .catch(err => dispatch(AuthActions.logout()));
};
