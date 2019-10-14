import {GET_NOTIFICATIONS_SUCCESS, RESPOND_ORG_INVITE_SUCCESS, RESPOND_FRIEND_REQUEST_SUCCESS, REMOVE_ORG_NOTIFICATIONS_SUCCESS,REMOVE_FRIEND_NOTIFICATIONS_SUCCESS} from "../actions/types"
const intialState = {
    orgInvites :[],
    friendRequests : [],
    acceptedOrgInvites : [],
    acceptedFriendRequests :[]
}

export default (state=intialState, action) =>{
    Object.freeze(state)
    switch(action.type){
        case GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                friendRequests: action.payload,
            }
        case RESPOND_ORG_INVITE_SUCCESS:
            let newState = state.orgInvites
            let idx = null
            for (let i in newState){
                let obj = newState[i]
                if (obj.id == action.payload.id){
                    idx = parseInt(i)
                    break;
                }
            }

            newState.splice(idx, 1)
            return {
                ...state,
                orgInvites: newState
            }

        case RESPOND_FRIEND_REQUEST_SUCCESS:
                let newState2 = state.friendRequests
                let idx2 = null
                for (let i in newState2){
                    let obj = newState2[i]
                    if (obj._id == action.payload._id){
                        idx2 = parseInt(i)
                        break;
                    }
                }
    
                newState2.splice(idx2, 1)
                return {
                    ...state,
                    friendRequests: newState2
                }

        case REMOVE_ORG_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                acceptedOrgInvites: []
            }
        case REMOVE_FRIEND_NOTIFICATIONS_SUCCESS:
                return {
                    ...state,
                    acceptedOrgInvites: []
                }
        default:
            return state
    }
}