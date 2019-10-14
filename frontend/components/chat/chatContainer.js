import {connect} from 'react-redux'
import Chat from './chat'
import * as ChatActions from '../../actions/chatActions'


const mapStateToProps = (state) =>({
    me: state.auth.user,
    conversations: state.auth.conversations,
    friends: state.auth.friends,
    messages: state.chat.messages
})

const mapDispatchToProps = (dispatch) =>({
    makeConvo: (id) => dispatch(ChatActions.makeConversation(id)),
    sendMessage: (data) => dispatch(ChatActions.sendMessage(data)),
    getAllMessages: (id) => dispatch(ChatActions.getAllMessages(id)),
    addMessage: (message) => dispatch(ChatActions.sendMessageSuccess(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)