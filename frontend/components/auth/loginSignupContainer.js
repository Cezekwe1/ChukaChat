import {connect} from 'react-redux'
import LoginSignup from './loginSignup'
import * as AuthActions from "../../actions/authActions"
const mapStateToProps = (state, {location}) => {
    const formType = location.pathname.slice(1)
    return {
      formType,
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch, {location}) =>{
    const processType = (location.pathname.slice(1) == 'login')? AuthActions.login: AuthActions.signup
    return {
        process: user => dispatch(processType(user)),
        logout: () => dispatch(AuthActions.logout())
        
    }

}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginSignup)