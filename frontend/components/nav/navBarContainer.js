import {connect} from "react-redux"
import NavBar from "./navBar"
import * as SearchActions from "../../actions/searchActions"
import * as AuthActions from "../../actions/authActions"
import * as NotificationsActions from "../../actions/notificationsActions"
import * as ChatActions from "../../actions/chatActions"

const mapStateToProps = (state,{history}) =>{
    
    return {
        history,
        auth: state.auth,
        filteredMembers: state.search.filteredMembers,
        notifications: state.notifications
    }
}

const mapDispatchToProps = (dispatch) => ({
    search: (term) => dispatch(SearchActions.search(term)),
    updateOrg: (id) => dispatch(AuthActions.updateOrg(id)),
    logout: ()=>dispatch(AuthActions.logout()),
    getNotifications: ()=>dispatch(NotificationsActions.getNotifications()),
    respondFriendRequest: (data)=>dispatch(NotificationsActions.respondFriendRequest(data)),
    respondOrgInvite: (data)=>dispatch(NotificationsActions.respondOrgInvite(data)),
    removeOrgNotifications: (data)=>dispatch(NotificationsActions.removeOrgNotifications(data)),
    removeFriendNotifications: (data)=>dispatch(NotificationsActions.removeOrgNotifications(data)),
    clearOutSearch: () => dispatch(SearchActions.clearOut()),
    clearConvo: () => dispatch(ChatActions.clearConvo())
})

export default connect(mapStateToProps,mapDispatchToProps)(NavBar)