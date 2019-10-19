import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  UPDATE_CURRENT_ORG_SUCCESS,
  ADD_ORG_SUCCESS
} from "./types";
import * as AuthUtil from "../utilities/authUtil";
import * as ChatActions from "./chatActions";
import * as SearchActions from "./searchActions";

const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  payload: data
});

const loginFailure = data => ({
  type: LOGIN_FAILURE,
  payload: data
});

const signupSuccess = data => ({
  type: SIGNUP_SUCCESS,
  payload: data
});

const signupFailure = data => ({
  type: SIGNUP_FAILURE,
  payload: data
});

const logoutSuccess = data => ({
  type: LOGOUT_SUCCESS
});

const logoutFailure = data => ({
  type: LOGOUT_FAILURE,
  payload: data
});

const updateCurrentOrgSuccess = data => ({
  type: UPDATE_CURRENT_ORG_SUCCESS,
  payload: data
});

const addOrgSuccess = data => ({
  type: ADD_ORG_SUCCESS,
  payload: data
});

export const login = ({ username, password }) => dispatch => {
  return AuthUtil.login(username, password)
    .then(res => {
      const token = res.data.token;
      const friends = res.data.user.friends;
      const user = res.data.user;
      const conversations = res.data.user.conversations;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("friends", JSON.stringify(friends));
      localStorage.setItem("conversations", JSON.stringify(conversations));
      dispatch(
        loginSuccess({
          token,
          friends,
          user,
          conversations
        })
      );
    })
    .catch(err => {
      dispatch(loginFailure(err));
    });
};

export const logout = () => dispatch => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("friends");
  localStorage.removeItem("conversations");
  dispatch(ChatActions.clearConvo());
  dispatch(SearchActions.clearOut());
  dispatch(logoutSuccess());
};

export const checkAuthState = () => dispatch => {
  const token = localStorage.getItem("token");
  const friends = JSON.parse(localStorage.getItem("friends"));
  const user = JSON.parse(localStorage.getItem("user"));
  const conversations = JSON.parse(localStorage.getItem("conversations"));
  if (token === undefined) {
    dispatch(logout());
  } else {
    dispatch(
      loginSuccess({
        token,
        friends,
        user,
        conversations
      })
    );
  }
};

export const signup = ({ username, password }) => dispatch => {
  return AuthUtil.signup(username, password)
    .then(res => {
      const token = res.data.token;
      const friends = res.data.user.friends;
      const user = res.data.user;
      const conversations = res.data.user.conversations;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("friends", JSON.stringify(friends));
      localStorage.setItem("conversations", JSON.stringify(conversations));
      dispatch(
        signupSuccess({
          token,
          friends,
          user,
          conversations
        })
      );
    })
    .catch(err => {
      dispatch(signupFailure(err));
    });
};

export const updateOrg = id => dispatch => {
  return AuthUtil.changeCurrentOrg(id).then(res => {
    const current_organization = res.data.current_organization;
    const organization_members = res.data.members;
    localStorage.setItem(
      "current_organization",
      JSON.stringify(current_organization)
    );
    localStorage.setItem(
      "organization_members",
      JSON.stringify(organization_members)
    );
    dispatch(
      updateCurrentOrgSuccess({ current_organization, organization_members })
    );
  });
};

export const addOrg = org => dispatch => {
  return AuthUtil.addOrg(org).then(res => {
    let newOrg = res.data;
    let orgs = JSON.parse(localStorage.getItem("organizations"));
    orgs.push(newOrg);
    localStorage.setItem("organizations", JSON.stringify(orgs));
    dispatch(addOrgSuccess(newOrg));
  });
};

export const getMe = () => dispatch => {
  return AuthUtil.getMe()
    .then(res => {
      const token = localStorage.getItem("token");
      const friends = res.data.friends;
      const user = res.data;
      const conversations = res.data.conversations;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("friends", JSON.stringify(friends));
      localStorage.setItem("conversations", JSON.stringify(conversations));

      dispatch(
        loginSuccess({
          token,
          friends,
          user,
          conversations
        })
      );
    })
    .catch(err => {
      dispatch(logout);
    });
};
