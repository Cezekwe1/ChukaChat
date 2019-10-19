import * as Profile_Util from "../utilities/profileUtil";
import * as AuthActions from "./authActions";
import {
  GET_PROFILE_SUCCESS,
  SENT_FRIEND_REQUEST_SUCCESS,
  SENT_ORG_INVITE_SUCCESS,
  REMOVE_FRIEND_SUCCESS,
  REMOVE_MEMBER_SUCCESS,
  MAKE_ADMIN_SUCCESS,
  UPDATE_SUCCESS
} from "../actions/types";

const getProfileSuccess = person => ({
  type: GET_PROFILE_SUCCESS,
  payload: person
});

const sentFriendRequestSuccess = () => ({
  type: SENT_FRIEND_REQUEST_SUCCESS
});
const sentOrgInviteSuccess = () => ({
  type: SENT_ORG_INVITE_SUCCESS
});
const removeFriendSuccess = id => ({
  type: REMOVE_FRIEND_SUCCESS,
  payload: id
});
const removeMemberSuccess = () => ({
  type: REMOVE_MEMBER_SUCCESS
});

const makeAdminSuccess = () => ({
  type: MAKE_ADMIN_SUCCESS
});

const updateSuccess = payload => ({
  type: UPDATE_SUCCESS,
  payload
});

export const getPerson = id => dispatch => {
  return Profile_Util.getPerson(id)
    .then(res => {
      dispatch(getProfileSuccess(res.data));
    })
    .catch(err => dispatch(AuthActions.logout()));
};

export const sendOrgInvite = id => dispatch => {
  return Profile_Util.sendOrgInvite(id).then(() => {
    dispatch(sentOrgInviteSuccess());
  });
};

export const sendFriendRequest = id => dispatch => {
  return Profile_Util.sendFriendInvite(id)
    .then(res => {
      if (res.data) {
        dispatch(sentFriendRequestSuccess());
      }
    })
    .catch(err => dispatch(AuthActions.logout()));
};

export const removeFriend = id => dispatch => {
  return Profile_Util.removeFriend(id)
    .then(res => {
      dispatch(removeFriendSuccess(id));
      dispatch(AuthActions.getMe());
    })
    .catch(err => dispatch(AuthActions.logout()));
};

export const removeMember = data => dispatch => {
  return Profile_Util.removeMember(data).then(() => {
    let id = data.id;
    let friends = JSON.parse(localStorage.getItem("organization_members"));
    let idx;
    for (let i in friends) {
      let current = friends[i];
      if (current.id == id) {
        idx = parseInt(i);
        break;
      }
    }
    if (idx) {
      friends.splice(idx, 1);
    }
    localStorage.setItem("organization_members", JSON.stringify(friends));
    dispatch(removeMemberSuccess());
  });
};

export const makeAdmin = data => dispatch => {
  return Profile_Util.makeAdmin(data).then(() => {
    dispatch(makeAdminSuccess());
  });
};
