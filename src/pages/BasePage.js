import React from 'react';
import httpUtil from '../utils/HttpUtils';



class BasePage extends React.Component {   
    componentWillMount = () =>{
        console.log("basePage[Will]");
    }
    componentDidMount =() =>{        
        console.log("basePage[Did]");
    }
}
export default BasePage;