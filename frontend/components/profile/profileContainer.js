import { connect } from "react-redux";
import Profile from "./profile";
import * as ProfileActions from "../../actions/profileActions";

const mapStateToProps = (state,{match}) => {
  let id = match.params.id;
  let areFriends = false
  for (let friend of  state.auth.user.friends){
    if (id == friend._id){
      areFriends = true
    }
  }
  
  return {
    id,
    areFriends,
    currentUser: state.auth,
    profile: state.profile.user,
    pending: state.profile.user.pending
  };
};
const mapDispatchToProps = dispatch => ({
  getProfile: id => dispatch(ProfileActions.getPerson(id)),
  sendOrgInvite: id => dispatch(ProfileActions.sendOrgInvite(id)),
  sendFriendRequest: id => dispatch(ProfileActions.sendFriendRequest(id)),
  removeFriend: id => dispatch(ProfileActions.removeFriend(id)),
  removeMember: data => dispatch(ProfileActions.removeMember(data)),
  makeAdmin: data => dispatch(ProfileActions.makeAdmin(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
