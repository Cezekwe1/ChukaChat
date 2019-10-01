import {connect} from 'react-redux'
import App from './App'
import * as AuthActions from '../../actions/authActions'


const mapStateToProps = (state) =>({
    coin: state.auth,
    isAuthenticated: state.auth.token !== null
})

const mapDispatchToProps = (dispatch) =>({
    checkAuthState : () => {dispatch(AuthActions.checkAuthState())}
})

export default connect(mapStateToProps, mapDispatchToProps)(App)