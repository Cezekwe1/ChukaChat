import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom'
import React from 'react'
import AppContainer from './components/app/AppContainer';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css"


const Root = ({ store }) =>(
    <Provider store = {store}>
        <HashRouter>
            <AppContainer />
        </HashRouter>
    </Provider>
);


export default Root;
