import React from 'react';
import PropTypes from 'prop-types'
import cookie from 'react-cookies';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import webUtil from '../utils/WebUtils';
import httpUtil from '../utils/HttpUtils';
import OrderList from './orders/OrderList';
import CreateOrder from './orders/CreateOrder';
import EditOrder from './orders/EditOrder';
import ViewOrder from './orders/ViewOrder';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
/**
 * 控制台页面
 */
class MainPage extends React.Component {
    state = {
        currentMenuIndex:'order',
        routes:<Content></Content>
    }
    static childContextTypes = {
        menuRoute:PropTypes.func
    }

    getChildContext(){
        return{
            menuRoute:(key)=>{
                this.setState({
                    currentMenuIndex:key
                })
            }
        }
    }
    
    componentWillMount = () =>{        
        if(cookie.load("chToken")===undefined){
            this.props.history.push("/login");            
        }else{
            window.config.token = cookie.load("chToken");
        }
        const pathName = webUtil.getRouteName(this.props.location.pathname);
        var menuItemTag = pathName;
        if(menuItemTag===undefined || pathName===''){
            menuItemTag = 'dash.order';
        }
        this.setState({
            currentMenuIndex:menuItemTag
        });
    }
    componentDidMount =() =>{
        if(window.config.token===undefined){
            return null;
        }
        if(window.config.token===undefined){
            return undefined;
        }
        const base = this;
        httpUtil.get("/api/user/my/info").then(function(response){
            window.config.user = response.user;
            base.setState({
                routes:<Content>                          
                <Route path="/" exact component={OrderList} />
                <Route path="/dash" exact component={OrderList} />
                <Route path="/dash/order" exact component={OrderList} />
                <Route path="/dash/order/create" exact component={CreateOrder} />                
                <Route path="/dash/order/view/:id" component={ViewOrder} />             
                <Route path="/dash/order/edit/:id" component={EditOrder} />  
                </Content>
            })

        });
    }
    handlerClick=(e)=>{
        this.setState({
            currentMenuIndex:e.key
        })
    }
   
    render(){   
        return (
            <Layout>
                <Header>
                    
                </Header>
                <Layout>
                    <Sider width={200}>
                        <Menu onClick={this.handlerClick} mode="inline" selectedKeys={[this.state.currentMenuIndex]} defaultOpenKeys={['orders']} style={{ height: '100%', paddingTop:14}}>
                            <SubMenu key="orders" title={<span><Icon type="audit" />我的订单</span>}>
                                <Menu.Item key="dash.order">
                                    <Link to='/dash/order'>订单列表</Link>
                                </Menu.Item>
                                <Menu.Item key="dash.order.create">
                                    <Link to='/dash/order/create'>创建订单</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="users" title={<span><Icon type="team" />用户管理</span>}>
                                <Menu.Item key="dash.user.info">
                                    <Link to='/dash/order'>用户列表</Link>
                                </Menu.Item>
                                <Menu.Item key="dash.user.add">添加用户</Menu.Item>
                            </SubMenu>
                            <SubMenu key="my" title={<span><Icon type="user" />个人资料</span>}>
                                <Menu.Item key="dash.my.info">
                                    <Link to='/dash/order'>修改资料</Link>
                                </Menu.Item>
                                <Menu.Item key="dash.my.password">修改密码</Menu.Item>
                            </SubMenu>                            
                        </Menu>
                    </Sider>
                    <Layout style={{overflow:'auto',backgroundColor:'white',padding:'12px'}}>
                        {this.state.routes}
                    </Layout>                    
                </Layout>            
            </Layout>
        );
    }
}

export default MainPage;