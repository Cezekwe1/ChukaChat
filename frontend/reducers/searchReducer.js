import {SEARCH_SUCCESS, CLEAR_OUT_MEMBERS_SUCCESS} from "../actions/types"

const intialState = {
    filteredMembers: []
}


export default (state = intialState, action) =>{
    let  newState = state 
    Object.freeze(state)
    switch(action.type){
        case SEARCH_SUCCESS:
            let obj = {
                ...newState,
                filteredMembers: action.payload
            }
            
            return obj
            break;
        case CLEAR_OUT_MEMBERS_SUCCESS:
            return {
                ...newState,
                filteredMembers: []
            }
        default:
            return state
    }
}
