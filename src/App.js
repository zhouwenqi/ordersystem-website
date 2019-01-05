import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import LogoutPage from './pages/LogoutPage';
import './App.css';

window.config = {
  apiUrl:"http://localhost:9018"
};
window.ws = undefined;
window.wsconnection=function(){
    var url = window.config.apiUrl.replace("http:","ws:").replace("https:","wss:");
    url += "/websocket/server/"+window.config.token;
    window.ws = new WebSocket(url);
    window.ws.onopen = function(event){

        console.log(event);
    }
    window.ws.onmessage = function(event){        
        console.log(event.data);
    }
}

class App extends Component {
    componentWillMount = () =>{
      console.log("appUrl:"+window.config.appUrl);
    }

    state = {visible:false}
    showModal = () =>{
        this.setState({visible:true,});
    }
    hideModal = () =>{
        this.setState({visible:false,});
    }
    render() {
        return (
        <BrowserRouter>
            <React.Fragment>
                <Route path="/" exact component={MainPage} />
                <Route path="/dash" component={MainPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/logout" component={LogoutPage} />
            </React.Fragment>            
        </BrowserRouter>
        );
    }
}
export default App;
