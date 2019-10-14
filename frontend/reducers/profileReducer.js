import {
    GET_PROFILE_SUCCESS,
    SENT_FRIEND_REQUEST_SUCCESS,
    SENT_ORG_INVITE_SUCCESS,
    REMOVE_MEMBER_SUCCESS,
    REMOVE_FRIEND_SUCCESS,
    MAKE_ADMIN_SUCCESS
  } from "../actions/types";
  const intialState = {
    user: {}
  };
  
  export default (state = intialState, action) => {
    Object.freeze(state);
    switch (action.type) {
      case GET_PROFILE_SUCCESS:
        return {
          ...state,
          user: action.payload
        };
      case SENT_FRIEND_REQUEST_SUCCESS:
        return {
          ...state,
          user: {
            ...state.user,
            pending_friend: true
          }
        };
      case SENT_ORG_INVITE_SUCCESS:
        let obj = {
          ...state,
          user: {
            ...state.user,
            pending_org: true
          }
        };
        
        return obj;
      case REMOVE_FRIEND_SUCCESS:
        let obj1;
        if (action.payload == state.user.id) {
         
          obj1 = {
            ...state,
            user: {
              ...state.user,
              are_friends: false
            }
          };
        } else {
          obj1 = state
        }
        
        return obj1;
      case REMOVE_MEMBER_SUCCESS:
        return {
          ...state,
          user: {
            ...state.user,
            is_member: false
          }
        };
        break;
      case MAKE_ADMIN_SUCCESS:
        return {
          ...state,
          user: {
            ...state.user,
            is_admin: true
          }
        }
      default:
        return state;
    }
  };
  