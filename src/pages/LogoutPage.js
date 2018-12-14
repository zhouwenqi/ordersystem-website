import React from 'react';
import cookie from 'react-cookies';

class LogoutPage extends React.Component {
    componentWillMount = () =>{           
        cookie.remove("chToken");
        this.props.history.push("/login");    
    }
    render = ()=>{
        return(<div>5555</div>);
    }
}
export default LogoutPage;