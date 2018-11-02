import React, { Component } from 'react';
import logo from './logo.svg';
import { Modal, Button } from 'antd';
import Login from './components/login'

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
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. 2018/11/12
          </p>
          <Button type="primary" onClick={this.showModal}>Import ANTD</Button>
          <Modal title="modal" visible={this.state.visible} onOk={this.hideModal} onCancel={this.hideModal} okText="ok" cancelText="cancel">
              <p>Bla bla...1</p>
              <p>Bla bla...2</p>
              <p className="mebox">Bla bla...3</p>              
          </Modal>
          <Login />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
