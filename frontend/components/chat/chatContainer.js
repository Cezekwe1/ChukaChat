import {connect} from 'react-redux'
import Chat from './chat'
import * as ChatActions from '../../actions/chatActions'
import * as AuthActions from '../../actions/authActions'
import * as ProfileActions from '../../actions/profileActions'




const mapStateToProps = (state) =>({
    me: state.auth.user,
    conversations: state.auth.conversations,
    friends: state.auth.friends,
    messages: state.chat.messages,
    currentConvo: state.chat.currentConvo

})

const mapDispatchToProps = (dispatch) =>({
    makeConvo: (id) => dispatch(ChatActions.makeConversation(id)),
    sendMessage: (data) => dispatch(ChatActions.sendMessage(data)),
    getAllMessages: (id) => dispatch(ChatActions.getAllMessages(id)),
    addMessage: (message) => dispatch(ChatActions.sendMessageSuccess(message)),
    setCurrentConvo: (convo) => dispatch(ChatActions.setCurrentConvo(convo)),
    getMe: () => dispatch(AuthActions.getMe()),
    deleteFriend: (id) => dispatch(ProfileActions.removeFriend(id)),
    deleteConversation: (id) => dispatch(ChatActions.deleteConversation(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)