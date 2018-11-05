import React from 'react';

class LoginPage extends React.PureComponent {
    render(){
        return (
            <div>
                <h1>Login - Page</h1>
                <input type="text" id="uid" /><br />
                <input type="password" id="pwd" /><br />
                <button>登录</button>
            </div>
        );
    }
}

export default LoginPage;