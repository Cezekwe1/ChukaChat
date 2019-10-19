import {connect} from 'react-redux'
import Home from './home'
import * as AuthActions from "../../actions/authActions"



const mapStateToProps = (state) =>({})

const mapDispatchToProps = (dispatch) =>({
    login: (user) => dispatch(AuthActions.login(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)