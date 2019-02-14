import React from 'react';

/**
 * 基本页面
 */
class BasePage extends React.Component {   
    componentWillMount = () =>{
        console.log("basePage[Will]");
    }
    componentDidMount =() =>{        
        console.log("basePage[Did]");
    }
    // 判断是否有基本权限
    getIsBaseAccess = ()=>{
        const user = window.config.user; 
        if(user.role==='follow' || user.role==='manager' || user.rolw==='employee'){
            return true;
        }
        return false;
    }
    // 判断是否是跟单员
    getIsFollow = ()=>{
        const user = window.config.user; 
        return user.role ==='follow';
    }
}
export default BasePage;