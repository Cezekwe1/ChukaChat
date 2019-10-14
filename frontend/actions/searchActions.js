import {
  SEARCH_SUCCESS,
  GET_PROFILE_SUCCESS,
  CLEAR_OUT_MEMBERS_SUCCESS
} from "./types";
import * as Search_Util from "../utilities/searchUtil";
import * as AuthActions from './authActions'
const searchSuccess = members => ({
  type: SEARCH_SUCCESS,
  payload: members
});

const clearOutSuccess = () => ({
  type: CLEAR_OUT_MEMBERS_SUCCESS
});

export const search = term => dispatch => {
  return Search_Util.search(term).then(res => {
    
    dispatch(searchSuccess(res.data));
  }).catch(err => dispatch(AuthActions.logout()));
};

export const clearOut = () => dispatch => {
  return dispatch(clearOutSuccess());
};
