import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import LogoutPage from './pages/LogoutPage';


import './App.css';

window.config = {};

class App extends Component {
  componentWillMount = () =>{
    
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
            <Route path="/login" component={LoginPage} />
            <Route path="/logout" component={LogoutPage} />
          </React.Fragment>            
      </BrowserRouter>
    );
  }
}

export default App;
