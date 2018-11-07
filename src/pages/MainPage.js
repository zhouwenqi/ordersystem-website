import React from 'react';
import cookie from 'react-cookies';
import httpUtil from '../utils/HttpUtils';

/**
 * 控制台页面
 */
class MainPage extends React.Component {
    componentWillMount = () =>{
        if(cookie.load("chToken")===undefined){
            this.props.history.push("/login");            
        }else{
            window.config.token = cookie.load("chToken");
        }
    }
    componentDidMount =() =>{
        if(window.config.token===undefined){
            return;
        }
        httpUtil.get("/api/user/my/info").then(function(response){
            window.config.user = response.user;
        });
    }
    render(){
        return (
            <div>
                <h1>Main - Page</h1>
            </div>
        );
    }
}

export default MainPage;