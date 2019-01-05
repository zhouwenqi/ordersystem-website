import React from 'react';
import PropTypes from 'prop-types'
import cookie from 'react-cookies';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon,Row,Col,Modal,Badge } from 'antd';
import WebUtils from '../utils/WebUtils';
import HttpUtils from '../utils/HttpUtils';
import OrderList from './orders/OrderList';
import OrderManagerList from './orders/OrderManagerList';
import CreateOrder from './orders/CreateOrder';
import EditOrder from './orders/EditOrder';
import ViewOrder from './orders/ViewOrder';
import EditUserinfo from './users/EditUserinfo';
import EditPassword from './users/EditPassword';
import BranchList from './branchs/BranchList';
import CreateBranch from './branchs/CreateBranch';
import EditBranch from './branchs/EditBranch';
import UserList from './users/UserList';
import CreateUser from './users/CreateUser';
import LogList from './setup/LogList';
import CreateNote from './setup/CreateNote';
import EditNode from './setup/EditNote';
import NoteList from './setup/NoteList';
import Index from './home/Index';
import AmountCharts from './charts/AmountCharts';
import CategoryCharts from './charts/CategoryCharts';

import './mainPage.css';
import Role from '../common/Role';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const Confirm = Modal.confirm;

/**
 * 进入全屏
 */
function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}


/**
 * 控制台页面
 */
class MainPage extends React.Component {
    state = {
        currentMenuIndex:'order',
        routes:<Content></Content>,
        isAdmin:false,
        isManager:false,
        isFollow:false,
        isLogin:false,
        isFullScreen:false,
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
            window.wsconnection();
        }
        const pathName = WebUtils.getRouteName(this.props.location.pathname);
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
        HttpUtils.get("/api/user/my/info").then(function(response){
            if(!response){
                cookie.remove("chToken");
                window.location.href = "/login";
            }
            if(!response.user.isEnabled){
                cookie.remove("chToken");
                window.location.href = "/login";
            }
            window.config.user = response.user;
            let OrderListRoute = <Route path="/dash/order" exact component={OrderList} />;
            const isManager = window.config.user.role==='manager';
            const isAdmin = window.config.user.role==='manager' || window.config.user.role==='employee';
            const isFollow = window.config.user.role==='follow';
            if(isAdmin || isFollow){
                OrderListRoute = <Route path="/dash/order" exact component={OrderManagerList} />;
            }
            base.setState({
                routes:<Content>                          
                <Route path="/" exact component={OrderList} />
                <Route path="/dash" exact component={Index} />
                {OrderListRoute}                
                <Route path="/dash/order/create" component={CreateOrder} /> 
                <Route path="/dash/order/view/:id" component={ViewOrder} />             
                <Route path="/dash/order/edit/:id" component={EditOrder} />
                <Route path="/dash/user/list" component={UserList} />
                <Route path="/dash/user/create" component={CreateUser} />
                <Route path="/dash/user/edit/:id" component={EditUserinfo} />
                <Route path="/dash/my/user/edit" component={EditUserinfo} />
                <Route path="/dash/user/password/edit/:id" component={EditPassword} />
                <Route path="/dash/my/password/edit" component={EditPassword} />
                <Route path="/dash/branch/list" component={BranchList} />
                <Route path="/dash/branch/add" component={CreateBranch} />
                <Route path="/dash/branch/edit/:id" component={EditBranch} />
                <Route path="/dash/log/list" component={LogList} />
                <Route path="/dash/note/list" component={NoteList} />
                <Route path="/dash/note/create" component={CreateNote} />
                <Route path="/dash/note/edit/:id" component={EditNode} />
                <Route path="/dash/charts/amount" component={AmountCharts} />
                <Route path="/dash/charts/category" component={CategoryCharts} />
                
                </Content>,
                isAdmin:isAdmin,
                isManager:isManager,
                isFollow:isFollow,
                isLogin:true,
            })

        });
    }
    handlerClick=(e)=>{
        this.setState({
            currentMenuIndex:e.key
        })
    }

    /**
     * 设置全屏
     */
    onFullScreen=()=>{
        const isFullScreen = this.state.isFullScreen;
        if(isFullScreen){
            exitFullscreen();
        }else{
            requestFullScreen();
        }
        this.setState({
            isFullScreen:!isFullScreen
        })
    }

    /**
     * 退出系统
     */
    onExit=()=>{
        Confirm({title:'退出登录',content:'您是否真的要退出系统？',
        onOk:()=>{
            window.location.href="/logout";
        },
        onCancel:()=>{}})
    }
   
    render(){        
        let subMainMenuTag = "我的订单"
        let subUserAdminMenu = undefined;
        let subBranchAdminMenu = undefined;
        let subSetupAdminMenu = undefined;
        let subChartAdminMenu = undefined;
        let subHomeAdminMenu = undefined;
        let creatOrderMenu = <Menu.Item key="dash.order.create">
            <Link to='/dash/order/create'>创建订单</Link>
        </Menu.Item>;

        // 后台操作管理员菜单
        if(this.state.isAdmin){
            subMainMenuTag = "订单管理"            
            subBranchAdminMenu = <SubMenu key="branches" title={<span><Icon type="branches" />网点管理</span>}>                
                <Menu.Item key="dash.branch.list">
                    <Link to='/dash/branch/list'>网点列表</Link>
                </Menu.Item>
                <Menu.Item key="dash.branch.add">
                    <Link to='/dash/branch/add'>添加网点</Link>
                </Menu.Item>
            </SubMenu>;
            // 如果是管理员
            if(this.state.isManager){
                subSetupAdminMenu = <SubMenu key="setting" title={<span><Icon type="setting" />系统设置</span>}>                
                    <Menu.Item key="dash.log.list">
                        <Link to='/dash/log/list'>系统日志</Link>
                    </Menu.Item>
                    <Menu.Item key="dash.note.list">
                        <Link to='/dash/note/list'>系统公告</Link>
                    </Menu.Item>
                </SubMenu>;
            }
            subChartAdminMenu = <SubMenu key="barChart" title={<span><Icon type="bar-chart" />统计报表</span>}>                
                <Menu.Item key="dash.charts.amount">
                    <Link to='/dash/charts/amount'>帐务信息统计</Link>
                </Menu.Item>
                <Menu.Item key="dash.charts.category">
                    <Link to='/dash/charts/category'>分类帐务统计</Link>
                </Menu.Item>
            </SubMenu>;    
            subUserAdminMenu = <SubMenu key="users" title={<span><Icon type="team" />用户管理</span>}>                
            <Menu.Item key="dash.user.list">
                <Link to='/dash/user/list'>用户列表</Link>
            </Menu.Item>
            <Menu.Item key="dash.user.add">
                <Link to='/dash/user/create'>添加用户</Link>
            </Menu.Item>
        </SubMenu>;         
        }
        // 如果是操作管理或者跟单员
        if(this.state.isAdmin || this.state.isFollow){
            subHomeAdminMenu = <Menu.Item key="dash">                    
                    <Link to='/dash'><Icon type="home" />首页</Link>
            </Menu.Item>
        }
        // 跟单员不能创建订单
        if(this.state.isFollow){
            creatOrderMenu = undefined;
        }
        let topInfo = undefined;
        let fullScreen = <a href="javascript:;" style={{marginRight:"10px"}} onClick={this.onFullScreen}><Icon title="全屏" type="fullscreen" /></a>
        if(this.state.isFullScreen){
            fullScreen = <a href="javascript:;" style={{marginRight:"10px"}} onClick={this.onFullScreen}><Icon title="退出全屏" type="fullscreen-exit" /></a>
        }
        if(this.state.isLogin){
            const user = window.config.user;
            topInfo = <div className="head-top-info">                
                <Icon type="user" style={{marginRight:"4px"}} /><label>{user.realName}<span>（</span><span style={{color:"#4ECC05"}}>{user.uid}</span><span>）</span></label>|<span className="slide">{WebUtils.getEnumTag(Role,user.role)}</span>
                <a href="javascript:;" style={{marginRight:"20px"}}><Badge style={{boxShadow:"none"}} count={5}><Icon type="bell" style={{margin:"0px 4px",color:"white"}} /><label>消息</label></Badge></a>
                {fullScreen}
                <a href="javascript:;" onClick={this.onExit}><Icon title="退出登录" type="poweroff" /></a>
            </div>;
        }        
        return (
            <Layout>
                <Header style={{padding:"0px 10px"}}>
                    <Row>
                        <Col className="head-top-logo" span={12}>
                            <a href="/" title="订单在线管理系统V1.0"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZgAAACICAYAAADamv16AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAG85JREFUeNrsnT1v5Eh6xx/trc82HHRv6qS5iWHAgXo+gSjgAIfifAJRiQMHnp7AwGWiMgMOpnXBBU5EAQ4cGFArPMDAsD/BtgIDzoadON1uA4aN9S7krtuH1xTFKtYr+0X/H1DQjESyXlj1/Osp1svJ8/MzAQAAAL75CkUAAAAAAgMAAAACAwAAAAIDAAAAQGAAAABAYAAAAEBgAAAAAAgMAAAACAwAAAAIDAAAAOCRr480X3HtZ8lhsQkrvHIAAIDAmBJtQrYJySYMJNfMNyHnAAAAICAnR7DZ5ZCF5YPBPU+bkLJXAwAA4IAEZsyGX3gVZS2EEJdiE04t7l1vwiSQNzOslYFgxekE3eWWcNmNJdcUXJcKSZ2KaTtE2rxP9x1kkt/nhnHqUErqYMrtxyR9ZPCczPB6H+WXWZSP6p6Zx05irHiPZS3/JZqpAUJgPIZ0E8rndkr+u6+4hpuweHZn7DFN0SbkirhyvoYQXoRxR7nJiFuelUmuzQzSYxKfKk4dCskzC8U9JnmRPcf0eh/lZ1Mvnjvak6sNEflaGbwvtGGD8JXHnqdQ97tNGEmuGfHfZ7WevQuZpefS1jPzkZ5qyO1Scc0lX5Oga/OHejPdhO86yg285Frh4R0Tk46/u7SjMbdFUZYDg/tEPf1i6Y29OXwJjDDSZ5rXXngYLhJu7AdPaR+wkXMhYfEcaMb30IPIRDWXfx+NUdUp+YBmaEX+BvKYaLQlm3aUcqdm5CjyOapheIGx8SROHXsAE8/lcOngxQwtK1ruyXOSGW7Ry/rM4Tv+3b4Ijcu3M7BtQ5Mjzl+i2WFLLTqndx7txhRVUY7rNOWhQyWf8MtZWcR5EahC55b5GFjcN+B7fbraKsN9VhOZcsf1bqYhLkt6/VG18sYGB9K+lhpl7fKROuOyLOn40BWOC673K832MdN4Z7Pa85KOuvqBry8gJ/4FJnFo7ANLox6qF24rMKljI/IpMNOOxjDgPMY7rHMTUg+nPvE1Rce7OoTee05hx+r34X2G8nDbOpGPkt/rtt2pwl6tuT3OWkQ87mhbIu4IcvIa1yEyV2Nv81LigJXa5h6XcdyR5zzojEefUZihOd3yUhnce65TXb3BGdcD9Bp/fp/HNlSWKAy5bSdP2JpLhbjECu+m4L8vFe0YE3f2UGAOveflw5vyWQaDHtPt2+N9dPQG3zLZkfWg2wSzGrpaSkQ2snhm/W9dQ5WrjvqJuhtAYFzB3mBvqwwSSwMAttxIOhb5keRPCMWpxIsghZeRWNa9pUHZiTQ8HWlneS8FpnC83+YD5z4Z5MLDM3xuV/Okcc2adje0JJucIYbGSjRHLaaKXvwxDNPIPIFKWHILD0I1lG0qzLli9GCM6ulXYFyN48zinlDG0TYvTw5xPgYwPj6uCcHYcz0wRaxbeNYMPo1l0RHGFuWYKozf8MDLL5V0ima1dtomsKeKshx7tCeLDiEDHgVGNiaqa5htjPqCK9y+eCMuBtv3sEbO3gApPIVsR3VN1fiO1XsZsWehCkPLunor6UXnB1xescTTmGm21bSHjiUEpkeBsX2pApcxd9+98KVDL1o06LnFffNAPXfxPt43vCMR1xXt74dI7GptTibp3IlhyEMdKks1PVzT7zCxIk7TIfeVpZcOgXHo+V8Z3nNFbkNdU89ejGuvPiGzobKnwEZgxs8/4RATtrU4NlSzmvID7U23tYm1RGDWEo9xl0a+RLX0LzBVhX6vYfTXfF0esHGZ8ugpPTHpfVN55Gsxg06vhwnUnbu2Oudjf71deC8DDe+l6/cTSTn58joiCIw+Pk+0nHHhp9wTOauJyoL/nns0rOJ5YhzaZbPEJ49CteJ8x/zMmLbjydX3ppywONC00fri3qAj8bnHOF2HB1M2bE3jfOnZaw1dfqrhrcKgziQWdc/kHYw7bAAIJDBVAU977D1VC6RsNq+bc2X0XSkKiIhx7y6l8EN45Q7eSx9xVt78g2RkoTyAvKj2FxyR2Y4X1RZUM00RT8jsW2gcsLNwdHx1BHkQjegd6X9oFx7VR8Iw1S4ERjbj8IwwTObqzT9KjPPZAaQ/9fy8pEWEl4prdb9XDRVpfUQ1PE6BqXoOMQvNbYvYLLkCXNH2kCvQP6oe8JQwzdPVSK8POO0+aTt+Y6bweHTtQUbyrY5mqILHKzB1oZmw2JzUQkT2uyUDf6ga8ikLUGRglCIU6YteenqA6Y4ozLlAiUHdu6TumaSibGXfe9cQmLchMGD/OwCPHSLzhdq3oB/Sdtv0kn7+7gaBed2LPrShmonCaJ9ohCdNgRF15laRjmvu4CQtzylI/Z03Iwy3Q2DA3hiUrqEc0aMUM5Hq2498z78TvcjRgeRVd3uV2GOcKR3WUFmiEEsdZKMSFy0dkIzU69XE96qHxrt5IPV3rDlhyB0CA/aGknB2RkhWtLvtgEyJFZ0FXYEpDMRr5VmAn1CXITBg/xBG4T0d7kfpfWdKdtsX9U0q+b3JNw3Z5pey51cTgpaOaX8izESFwIC9RRiQ8YEYwkPEZ089FK7DY13Xi296kURkRN27t0z3Dd8PcYHAgD2m5F7gOTd2HYO45mvfExa0dpVttucCOFB4uCbkFiJWDZd9y/Wpy6NZsrB8S4czBLlzTp6fn481b3Gjx4LexmEQkXx2GN4j2EXdQ72DwPzhICbRYxlJer4FbfdEAwAAcGACM2bvYdzoARQUZq8eEY/4qGmyJcaS3dyQQlPvDaEHBACAwFgyZIMtPIg/3YRftlzzwyb8Dxv1zJPBFWsqPjnc/8hp9mX8Kw/qQuJBVd5TgaoHAIDAdCMM6r9swh9rXv/jJvw3bVfI2iIM9aWHMvAx3TDm9OguAJzTdpt1AAA4Slxnkf3tJvyrgbgIxBEBYvbIv/H9NmSexEVQ7YE1dEjLZzJbXS6G8xYUfpFWzAGbSAIADkpghDj8ZhN+YXn/L/h+U5ERBvPaczmckt3Uw8whLUJkH8j/NvUpi9czC58I39N22irEBgDQC7ZDZOLD+nee0vB/m/AXpD9cVFK4vajOSX/YLqH2Q55MWXN5lo7PEc/IqXtn2iWnHYcjAQD20oP5Z49p+CPSX7mbUtiNDnW9GJ9nyvg4Pz1iYdTZ9nzE145R/QEA+yYwwjD9ped0/JWmwZsELo8z0tsCPvEsdBfktvX8jOSromWiNiMMlwEA9kxg/p7sv7vIEB/+/07DazjtoUx0PryHEDrbZ6aW5TLqQbABABAYI+JAaflrDc+pD7ryF0robMvVZSZaiiYAANgngfnzQGnpem7cU5l0DRuFEjpb0bpwiFN4MRGaAQAgBF+jCHbmKe0LQmBKvHYv3mf1UyzarWbpYZsgs87dmF5us1Q0yvMQ0j+s2ZHq/Rc91cFxrZNcxVnurI2LacqGISSqeLPnflh1pCPeUf5DvY/YMl7TEKLcskYchcdnqcJwE1KD+MpNmBi+v9ixXAvFPYWi7g8d615hWC8iLvtSoxxnFvW1CFzvq7qw0Ex/6jHeiWGdn7XUw1RxfeHYrlOcB/Oat7Y+BN6LGRMuszvS32BVDEUewtG6YnZh3mN82SZ8oZ8XK+vMyhTDwZ+5Z74PQ7tJrS6caqb/jrbnINl6SRk/4xOZbfJ7Qa/3bhTvW3YWjs6s2lTye/HM3EZg/jPQy+p6btFTpekazgglQE+W9z06xLmEwBg17IIb6OCI83nRgxgOuR3Z7oJRbbW0y+FsYZgfLOvCiIUyNbxvzHXw2nMdzCz/JsTnUnWfjcCEMvS/2xPPoit/KwcxCFGuM8dGAvTF5eyN5DencGukqrJ0nYk5oN0tGM7Jz16IdwYiM/ZUbrL8LBVe2tDGe7EVmH/chJ88Z1DssPybHRl2G4M9DRDv1KFy2JTLMlA+jpFQDXtfGQSsGzOPZVmJTJ8LhjPyt9FuJTJdIhlxPnW8lnktLA3zJSvjVNJRmHQ9y0ZghCfxH55f2r9reiihDaJ4KaWj4ttwT25DVaKXsTa4fs339Dm7STSQE0WQca64J9OM+6YjbtWzsg6DuObnv2t5pkj7ree60hfCiMaen5l2eIGi/b1vlOE7bh+7EMM2L+K6o9N2tQnf1NL/LdePtUOntmunjnq5xbUQGdRDlU2bSGzOQJKW7ciI5QyG8Sb84Gkm0A88k0Q37jLgLC6TmSWJx1lrkYdZJZHmTJaS3x/tWfDxTgoPM8SaZdo1K2doMNtr32eRtdWVocdZZCtFXHlHPtOOtEY9zCIrOtI/7LCZqvzLZpdNOvJtOisttSzjRNMOvyhX21lkC1Y116Gyn2g7K8ekFxSCWzL7DjLjnokrCfn50F5yD+tKMmQmfveRr8FOym7DBpXXaeIFFgeY/xHZHWMha7eyXvijRrvOO9pb6G2PIoX39cTxrzpsZmKRflW+rsj8O2ruwYuJqX3W37xZz12mKf+Wft4/zFZkfuL7f2sx1HLjufI8kf15MB8t41yT2fEAJhVoXBteqIaYxjyUgEV/ZuIvGwo5tn3cniTDOB88DZUlinag22mcKoaaQs98SzvEQaddFWyE2xDDsMOWPI0UHZw8QD5ldrA+ZTnTvdd1HYwQh1/xS/9R854f+fpfWYhLPSP3HhtW7GB4p2zETcbZ57SdFRKSxYH2nPeBWNHjzo5QqE8VounDkF0oRgJ0y3KlSMuIwn7sjxWdDZM2lhvEkVh6164d1KUiTpknN28rBx9bxRQc6a834W824c824ZcSj+W/NuGfNuEfPDTQlOO+c3hG5ZqvPJVBypWizThVFTGH0d+JWHQ1yEzToFRGMTSppucQeTYuaYsBqYbKbI3a2GNZFuxVyeIJ1bbOPKV/prBZ48bzxooOahmw7olO8yeJl7gwETxfe5GtWGB+zYUiGoY4M+ZPNuF/6edZZwX5H/vPa0bbZI1CNcQxC5CevNbwo5ongaGp3XGmUT8yTcP91NO7vNxRWaVcX5sdpGtuLzZtWOVZmBrK0jKekKMEprbSxKuUiWybOJnMppso0p5ze2jWgYFESOYyYf86UIH3+RG5ZEEb13p9bS9mXROjWU/pKgkcKpEHA3GIlGxEPkkMz9hjWdoY6EWHpxSibcceBbIyyC6LdlcScTV55rDj+VNqn5I90PVeBMe0F1k1s635gVuEb7hAk57EBYBDZkrtH6NPyW6YLEKR7tRrsq0DOmvrpN7LsQlM20soaLvdNwBAn1RiYK4tvJjSsie9j4bXB655jntIY+XFdKHscOA8GPAWUPayDOlr7yvdbz2hTlgtST5MMjU0cmVHeZq8m7jDKIag6EiPad06lG2HxHsWo0ID23YFgQFvgYLMh3bEPW1j2gPqZ7HqRNNwCQP3OVAaRJklLQbxjMzWAa08Csx4zzyYscfrm+kXk5Ha1sEkLfVZ3Hvecq1L3VB9iyGdNoXzYAAw73VP3lA5pLbGpWH81p7KUrX4NeRQuGyB5AWZDXmlBgKzUHhAUYsYFC0hpPfW+XwIDADmjeeS3s7R2sLI3Ug8OR/lOSL9lfwx+VuPYsqsw9PTYajI61NLp0YV50HshA6BAUDuwcw7DKaJyAwPuCwycj8qI+8wlmON8tulwVXF/UFDJKtzcAYG6VfFeXEInjQEBgC7nml1FknWIR5j6m/tVUhSx/tnCpGqyjJReC4lqTfLLHvocKi2p7pT1JeI1GcKLSUCvOqI8xOXa7SvlebYPvLHtN2q5bTxAhf8Mkz2PgLHQUp6s56aq5sLUi+KEwbvmkNzRk3M4lIZxfmBl2E1VHbt8AxRvp8VZflA2y2VStquXRspnrm27MnrbvwaN9KfKITumrY7hFTpj6l71tik42+qOC84PNJ2x5Cqw5PsutIci8BU2yTIDMGIwwVflxFOc3xLjDqMVH0Yo0nS0Xuu0NmO5hg8uoTsp9kK4fhI7bsE1N+VyTY5qaX3YpOHFef/c4dna5L+2w7vdsUi9V3Hcyqh2SuOYYhswoWv27gHXMELOuxxcdAPVQNfoyg6e9u6nsOtp7RcUf9DjwXH64N7zfJccJwHVwd9C0zEvRzxEp45VNPn0gAGfdrRG+rqcYYQmaTmIldlICpITm9n5tGxseB3N0dR/L7NuArExNFgimG0cwpzHooOIt53ZH8U9po9udQwTtHRefKQ/jX19JnAp8BU49fXDW9iwP+/47/HHg35B8dnnHrsAUXc+B7YVR014rlkT2sKz+kgKbnuXlk08mqj1WMhczCudYM55l782qAcb6ifs5R0Ox03hkJ5T+Y7HzfjtKmDRNtTbSPqaVHqiTg32ZOim4w72hz1WWdIeuPifaWnqvADgxcdEyYb1IkVjWpl8B6GjkbDJK6Yf0YSQSqpe8Gba76HEs94pTAisnIyMdqRJN8rC+M1rJVlLEnXwrIz6FonCoP6G0vSH2pfxKhWbqo6UIXS0taObcvGh8CkZH7o15oLxlZFM3KbzdLmckcOYleQ+UfDe3Kf+gkAAHuLq8C4eBJzsh8uW3n0XireW/aQXMTunHC6JQDgSHH9BpM4GPozS69hHEBcyEHsXLwQeDAAAAiMZ6Pscn8cqCxsT+ob7bD8AADgaAUm2sH9+zQDyzX/I1RBAAAEBgAAAIDAAAAAOHSBKXZwfxGoLFY7SAtWhgMAIDAScod7l5YGOtQKVNsV/fc7Kj8AADhqgSkdDGzm4Gk87pHA2OZjCYEBAEBg1Ig9yEz3xbl3NK6+t9q/JfstHITImu6uKnYySFD9AADHjK+9yEy2S/G1RYoQmQ8eniOMfUTuewSJPN1pxhdTT5vNAQDAIXswxMa52uVTtsuq+KB9Tv5Wr2fkZ+vqmPxsQCc8sm9JPmRY7QQbQVwAAPBg7GnuYFpSmDOzbTearAy+ELtZoHQ1dwYoUN32ApPddVdcb013eSgs05VQ9zc98ffrRsctNojn2fBekZf68RvYPw9oE+rI5L566NVpg6LRmQyXiYY1CZjOFRqhluf42ePzdA2t6mjttmdmFuk80RCTiF5u+T9oiMixvVsxMUeck3TL+ftes6zAAXMMCy1XLBbV8JTq8B9Rya8I30BAv2Tc4SjZgxAHzz3Q9nC+urhcN4QypcM7CXXBns4Tt8nzmteY0MsJLjGqBzyYQ6Ck7fedahhkXBMSk8OkQP+sLUT/zDHOttmMog5des5bzp0gnV3Al7V6O62lxfVQvC4iav8+GrWUTyzJY9nw4KshxqLmEZ7xMyqPBkBgDo7KUBV4xUDBpYaYiDp00jC4X2r/v2Xx6Or8TEl+btCS/1406m5dQO8Cl0VEeucaXSrKqdQoyzMOVxAYCAwAfTHw4JH0QdxiNHWYNq7/3CJAdSbsFZw2RMZ05qTq/Pf62fazwOVWxVV5LrMeRBNAYAD4Pfs8RFYo4npo/F82y0oMF2WGXnhMr2dJms6YHCrSXhf1EN7+hLbD0knNw5ny788pzOxSAIEB4JUBNjVyrgKjM0TmC5W4RI2/52x4Vy0is6YwJ7oWkjQ2xdVkmvJC4umVAUUNQGAAeIU4fO36iPN3bZD3go1wxD9jejmUZVJOQqTmElGue42YAAMgMAA4kteMtfguUP/QPJf0tOu0Dat99pzGagFxtfiyoO23n4nhsxb08rvRs+JvAEBgwMET8c9zz8+NSb5rREqvp+E2V/S3rTdp/q7yLKKaYPnmoSFeoaco1z2nrmHHppia7iQAIDAABEUY+lDDYWK/t0wial3GU3cmW0rmH8dPGp7DqcRIC0ETw2Cj2t/vAopZyunBwmMAgQHgCLy3U4n3tWJDX03pbU5R9v2dpFqTsqTXCyoBgMCAo2BO/mYUyZ6TW8YhjLrP84cmEkMvhp7qRznELSLjKjCyM4hG7PWJMippO7PuiV6vj0kaaSpRfQEEBuwzBb3c6scWlYiUtN22xGSzy9hjPocdeRxwHipvpi4yH+nlx36TOCcc70hyzZq208TvGt7WtCFszfTPUH0BBAbsOxG5r2sp9jyPOvuRndJ2BlklMhOFFxWx9xGxgGYNb+NBEdean1sXkXntPQz4eZOauIwa90NgwJsSmGpqZ9zovc7QGPbei+n7GX1tdln3JNp44r+PaiJTCUxE210AYnr9raS+hmbe4l3MFcK9oNcTIsT/6zPFPtB26KwpclNUW/BWBGbIDaFtA70zNhpLNiAFXv1ecU1+ZpVVz9A9YySi10NOUaA85grvpTpyom7Yv7PsXDWptmgZcP0faYj0fUNki9ozmt4PAEcvMNWsm67hhxH1u64A7DdnZDcsZ3pPSq8XdJ61GPZb7ijZelADiXjF3EZEndc5wnbCwjSoPfe0xdPB6n+gJNSBYym75wX/TAN7LjMy25/pjuQzakA/HYI6omfd3CV4Te07By/ZQNdDxRO9HibyTbPelBp5nbYYZ5lhN12pL/IsFqx+o/DcFoYdqlVH+5jDewG7EJghV+Y77rGd8c87/v0wQB4yDbe/DTSQ/RGYtMWwVutB7iUdioR/Ro2/TTTqy5q9BXEK6k3j7+ctceZ83U1LT37BBvecw6LFWOe0PWm1a0r2qiaUjxznR352W3rrh3v5JCL56bBloLYMjo3n52efYfGsZuE5vuEmrJ7tST2nB6E7xC3vYdjy+8KgXtXviQzqqKg7WeMZbf+v7s0d4hZ5nG7CmP8vy2tXyBzujTTujfn3Xaw4PxHqNIIs+PRgUuo+q+LU89DUmNy2LscwWf9MW4Z4VpIetOiZP3O96Tpo64ZenjnSRt6oo1mLN5U1htmERxSzZ3LZGMKrc8bXJArPZEL9b8kS0Xaq8UxxzYTL7jPpfWMS7U7MMPtC2+OdI1RvEGqILPZ8XR/Pgpvfv7icSgSn+S5HDUMnDPR7xbCNmEH2PW0XUzaN3YRefzxPqX3WYVoTkRUb3dOGKEYt6akWSu4TJef9U0vZFzXx/KQYar7h4bm5ouOYoj2BkAKj23sZo9jfJBH3eOssawa569vJsCYcNwqhGdF23Ub93iHHVwnHvMXgLmtG+RtO06jF44pZeGb87yeFh7YPFIrfVyLTVp6ijN6xB1TydVe1cmp29rBhJggmMAvHyg6Om8po37Z4CkSvh2+EEbtnL+Eb2i48rBYdRmzsmkNnty1eRP2e9yQfLpo07slp+1F9zf+u0lGv93Gtd7+PAtPWNj/W2mJzwaUo93OJaOS1sp/XPByIC3jFifgQ44mY9A5eeuexMurGKeOewk6hBu0ktF0YW/dwvvA7mRrWkSFt13o0985S3TOu/XtB8u83KQvSSiNfurtFZA3xzQ3qfGxxb9wQnJVDPpue6YqwJgYEFpiqd3PZs0EvyW6aMpHZ+eIgPEMYKgCOB9/rYCb0eg1BfegihLdgOyThc4t44AeICwDwYDqpNpysjMaMwp4bIYTCZPuO+rkbAAAADkhg+qZa3a0jMhAXAADoga+OJB/Vhn6q6auCe/auIC4AAAAPxoqEXq63KWm75TgAAAAIDAAAgEPlKxQBAAAACAwAAAAIDAAAAAgMAAAAAIEBAAAAgQEAAACBAQAAAPzy/wIMAF6G7MSd5R4bAAAAAElFTkSuQmCC" alt="订单在线管理系统V1.0" /></a>
                            <span>订单在线管理系统V1.0</span>
                        </Col>
                        <Col span={12} style={{textAlign:"right"}}>
                            {topInfo}
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider width={200}>
                        <Menu onClick={this.handlerClick} mode="inline" selectedKeys={[this.state.currentMenuIndex]} defaultOpenKeys={['orders']} style={{ height: '100%', paddingTop:14}}>
                            {subHomeAdminMenu}
                            <SubMenu key="orders" title={<span><Icon type="audit" />{subMainMenuTag}</span>}>
                                <Menu.Item key="dash.order">
                                    <Link to='/dash/order'>订单列表</Link>
                                </Menu.Item>
                                {creatOrderMenu}
                            </SubMenu>
                            {subBranchAdminMenu}
                            {subUserAdminMenu}
                            <SubMenu key="my" title={<span><Icon type="user" />个人资料</span>}>
                                <Menu.Item key="dash.my.user.edit">
                                    <Link to='/dash/my/user/edit'>修改资料</Link>
                                </Menu.Item>
                                <Menu.Item key="dash.my.password.edit">
                                    <Link to ='/dash/my/password/edit'>修改密码</Link>
                                </Menu.Item>
                            </SubMenu>  
                            {subChartAdminMenu} 
                            {subSetupAdminMenu}                                                   
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