import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
    Form, Input,Tabs, Button,Spin,Card,
     Row, Message, Radio, Col,Modal,Icon,
     Select
} from 'antd';
import { Chart, Tooltip, Axis, Legend, Bar } from 'viser-react';
import HttpUtils from '../../utils/HttpUtils';
import ChSearch from '../../components/ChSearch';
import './home.css';
/**
 * 首页
 */
class Index extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
        }
    }
    // 判断是否有基本权限
    getIsBaseAccess = ()=>{
        const user = window.config.user; 
        if(user.role==='follow' || user.role==='manager' || user.rolw==='employee'){
            return true;
        }
        return false;
    }
    static contextTypes = {
        menuRoute:PropTypes.func
    }
    componentDidMount = ()=>{
        const base = this;
        if(!this.getIsBaseAccess()){
            base.context.menuRoute('dash.order');
            base.props.history.push("/dash/order");
        }
    }
    render = ()=>{
        let bodyHtml = undefined;
        if(this.getIsBaseAccess()){
            const userData = [
                {"label":"普通用户","数量":0},
                {"label":"客户","数量":40},
                {"label":"工程人员","数量":15},
                {"label":"网点负责人","数量":5},
                {"label":"内部人员","数量":12},
                {"label":"跟单员","数量":0},
                {"label":"管理员","数量":4},
            ];

            bodyHtml = <div className="home-box">
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="card-box" style={{height:"300px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#2886fb",marginRight:"12px"}} type="audit"></Icon>订单信息</div>
                                <div className="card-head-right"><Link to='/dash/order'>更多</Link></div>
                            </div>
                            <div className="card-grid">
                                <div className="card-grid-row" style={{height:"160px"}}>                                    
                                    <div orderType="new" style={{width:"50%",paddingTop:"30px"}} className="grid-item">
                                        <label>新订单</label><br />
                                        <span style={{color:"#46f0ff"}}>15</span>
                                    </div>
                                    <div orderType="all" style={{width:"50%",paddingTop:"30px"}} className="grid-item">
                                        <label>全部订单</label><br />
                                        <span style={{color:"#ff5b5b"}}>343</span>
                                    </div>
                                </div> 
                                <div className="card-grid-row" style={{height:"100px"}}>                                    
                                    <div orderType="pending" style={{flex:"1"}} className="grid-item">
                                        <label>待派单</label><br />
                                        <span style={{color:"#f59e21"}}>3</span>
                                    </div>
                                    <div orderType="ongoing" style={{flex:"1"}} className="grid-item">
                                        <label>跟进中</label><br />
                                        <span style={{color:"#1890ff"}}>1564</span>
                                    </div>
                                    <div orderType="waitCheck" style={{flex:"1"}} className="grid-item">
                                        <label>待验收</label><br />
                                        <span style={{color:"#bc15aa"}}>87</span>
                                    </div>
                                    <div orderType="complete" style={{flex:"1"}} className="grid-item">
                                        <label>已完结</label><br />
                                        <span style={{color:"#19bc15"}}>329</span>
                                    </div>
                                    <div orderType="cancel" style={{flex:"1"}} className="grid-item">
                                        <label>已取消</label><br />
                                        <span style={{color:"#eeeeee"}}>852</span>
                                    </div>
                                </div>                               
                            </div>
                        </div>    
                        <div className="card-box" style={{marginTop:"20px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#23cb16",marginRight:"12px"}} type="user"></Icon>用户信息</div>
                                <div className="card-head-right"><Link to='/dash/user/list'>更多</Link></div>
                            </div>
                            <div className="card-charts">
                                <div className="charts-title">用户权限分类</div>
                                <Chart padding={[40,40]} forceFit height={300} data={userData}>
                                    <Tooltip />
                                    <Axis />
                                    <Legend position="top-center" />
                                    <Bar position="label*数量" color="label" />
                                </Chart>
                            </div>
                        </div>                    
                    </Col>
                    <Col span={12}>
                        <div className="card-box" style={{height:"300px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#f95c06",marginRight:"12px"}} type="flag"></Icon>最新公告</div>
                                <div className="card-head-right"><label>2018/12/25 14:50</label></div>
                            </div>
                            <div className="card-content">
                                <div>
                                In order to simulate the procedure, the temperature ofOxygeu into the stove has to follow the tracks of coal's precisely. 为真实地仿真这个过程，必须使进入护中的氧气温度高精度地跟踪煤温变化。www.dictall.com4Follow the tracks of statistic and analyses to ventilation system reliability running state, set up a suit of reliability evaluating indexes 'system adapted to it firstly; 通过对矿井通风系统可靠性运行状态的跟踪统计和分析，首先建立了一套适合于矿井通风系统可靠性评价指标体系；dict.cnki.net5It follow the tracks of new progress and development tendency of future for international material and heat treating technology. It is combined with national condition in China. It is primarily analysed and searched that for development blue drawing in fixture of vacuum heat treating technology in China. 跟踪国际材料热处理技术的最新进展和未来发展趋势，结合我国国情，对我国真空热处理的未来发展兰图，提出了初步的分析探讨。
                                </div>
                                <div style={{textAlign:"right"}}>
                                <span>发布帐号：18665111530</span>
                                </div>                            
                            </div>
                        </div>
                        <div className="card-box" style={{height:"391px",marginTop:"20px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#8c36c3",marginRight:"12px"}} type="rocket"></Icon>订单最新跟踪状态</div>
                                <div className="card-head-right"><label>2018/12/25 14:50</label></div>
                            </div>
                            <div className="card-table">
                                <table>                                    
                                    <tbody>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                        <tr>
                                            <td><a href="#">4234242083</a></td>
                                            <td>在要的粉的爱你的有的伯有</td>
                                            <td>2018/12/26 23:50:58</td>
                                        </tr>
                                    </tbody>
                                </table>                            
                            </div>
                        </div>
                    </Col>                    
                </Row>
            </div>
        }
        return(<div>{bodyHtml}</div>)
    }
}
export default Index;