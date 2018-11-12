import React from 'react';
import cookie from 'react-cookies';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import httpUtil from '../utils/HttpUtils';
import webUtil from '../utils/WebUtils';
import OrderList from './orders/OrderList';
import CreateOrder from './orders/CreateOrder';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
/**
 * 控制台页面
 */
class MainPage extends React.Component {
    state = {
        currentMenuIndex:'order'
    }
    componentWillMount = () =>{        
        if(cookie.load("chToken")===undefined){
            this.props.history.push("/login");            
        }else{
            window.config.token = cookie.load("chToken");
        }
        const pathName = webUtil.getRouteName(this.props.location.pathname);        
        console.log(pathName);
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
            return;
        }
        httpUtil.get("/api/user/my/info").then(function(response){
            window.config.user = response.user;
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
                            <SubMenu key="users" title={<span><Icon type="user" />个人中心</span>}>
                                <Menu.Item key="dash.user.info">
                                    <Link to='/dash/order'>修改资料</Link>
                                </Menu.Item>
                                <Menu.Item key="user.password">修改密码</Menu.Item>
                            </SubMenu>                            
                        </Menu>
                    </Sider>
                    <Layout style={{overflow:'auto'}}>
                        <Content style={{padding:'14px',background:'white'}}>                          
                            <Route path="/" exact component={OrderList} />
                            <Route path="/dash" exact component={OrderList} />
                            <Route path="/dash/order" exact component={OrderList} />
                            <Route path="/dash/order/create" exact component={CreateOrder} />
                        </Content>
                    </Layout>                    
                </Layout>            
            </Layout>
        );
    }
}

export default MainPage;