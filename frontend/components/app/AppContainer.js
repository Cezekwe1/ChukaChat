import {connect} from 'react-redux'
import App from './App'
import * as AuthActions from '../../actions/authActions'
import {checkCurrentConvo} from '../../actions/chatActions'


const mapStateToProps = (state) =>({
    coin: state.auth,
    me: state.auth.user,
    isAuthenticated: state.auth.token !== null
})

const mapDispatchToProps = (dispatch) =>({
    checkAuthState : () => {dispatch(AuthActions.checkAuthState())},
    checkCurrentConvo: () => {dispatch(checkCurrentConvo())},
    getMe: () => dispatch(AuthActions.getMe())

})

export default connect(mapStateToProps, mapDispatchToProps)(App)