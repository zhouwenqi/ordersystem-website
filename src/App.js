import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';


import './App.css';

class App extends Component {
  state = {visible:false}
  showModal = () =>{
    this.setState({visible:true,});
  }
  hideModal = () =>{
    this.setState({visible:false,});
  }
  render() {
    const HomePage=()=><div>HomePage</div>
    const UserPage=()=><div>UserPage</div>
    const StartLayout = () =>(
      <div>
        <header>4app</header>
        <main>
          <Route path = "/" exact component={HomePage} />
          <Route path="/user" component={UserPage} />
        </main>
      </div>
    )
    return (
      <BrowserRouter>
          <frames>
            <Route path="/" exact component={MainPage} />
            <Route path="/login" component={LoginPage} />
          </frames>
          
      </BrowserRouter>
    );
  }
}

export default App;
