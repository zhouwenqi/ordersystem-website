import React from 'react';

class MainPage extends React.Component {
    componentWillMount = () =>{
        this.props.history.push("/login");
    }
    render(){
        return (
            <div>
                <h1>Main - Page</h1>
                <a href="#">33333</a>
            </div>
        );
    }
}

export default MainPage;