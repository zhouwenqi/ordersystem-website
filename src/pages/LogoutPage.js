import React from 'react';
import cookie from 'react-cookies';

class LogoutPage extends React.Component {
    componentWillMount = () =>{           
        cookie.remove("chToken");
        this.props.history.push("/login");    
    }
    render = ()=>{
        return(<div></div>);
    }
}


export default LogoutPage;