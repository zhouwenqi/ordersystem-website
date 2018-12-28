import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
     Row, Col,Icon,Spin
     
} from 'antd';
import { Chart, Tooltip, Axis, Legend, Bar } from 'viser-react';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import axios from 'axios';
import BasePage from '../BasePage';
import OrderStatusTotal from '../../components/OrderStatusTotal';
import './home.css';
/**
 * 首页
 */
class Index extends BasePage {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
            userTotal:[],
            orderTotal:[
                {
                    "count": 0,
                    "tag": "待派单",
                    "status": "pending"
                },
                {
                    "count": 0,
                    "tag": "跟进中",
                    "status": "ongoing"
                },
                {
                    "count": 0,
                    "tag": "待验收",
                    "status": "waitCheck"
                },
                {
                    "count": 0,
                    "tag": "已完结",
                    "status": "complete"
                },
                {
                    "count": 0,
                    "tag": "已取消",
                    "status": "cancel"
                },
                {
                    "count": 0,
                    "tag": "全部订单",
                    "status": "all"
                },
                {
                    "count": 0,
                    "tag": "新订单",
                    "status": "new"
                }
            ],
            noteInfo:{
                content:<div className="noteNull">暂无公告</div>,
                title:undefined,
                createDate:undefined,            
            },
            orderEventData:[],
        }
    }
    
    static contextTypes = {
        menuRoute:PropTypes.func
    }
    componentDidMount = ()=>{
        const base = this;
        if(!this.getIsBaseAccess()){
            base.context.menuRoute('dash.order');
            base.props.history.push("/dash/order");
        }else{
            this.getIndexData();
        }
    }

    getIndexData=()=>{        
        const base = this;     
        base.setState({
            loading:true
        })               
        // 获取订单统计数据
        let requests = [HttpUtils.get("/api/order/home/total")];
        // 获取用户信息统计              
        requests.push(HttpUtils.get("/api/user/home/total"));
        // 获取公告信息
        requests.push(HttpUtils.get("/api/note/home"));
        // 获取订单事件信息
        requests.push(HttpUtils.get("/api/order/event/home"));
        axios.all(requests).then(axios.spread(function(orderTotal,userTotal,noteInfo,orderEventInfo){                    
            base.setState({
                loading:false,
                userTotal:userTotal.chartData,
                orderTotal:orderTotal.total,
                noteInfo:noteInfo.note,
                orderEventData:orderEventInfo.list,
            });
        }));          
        
    }

    render = ()=>{
        let bodyHtml = undefined;
        const noteInfo = this.state.noteInfo;
        const orderTotal = this.state.orderTotal;
        let orderEventHtml = <div style={{height:"350px",lineHeight:"350px",textAlign:"center"}}>暂无信息</div>;
        const orderEventData = this.state.orderEventData;
        if(orderEventData && orderEventData.length>0){
            let trs = [];
            orderEventData.map((item,index)=>{
                trs.push(<tr key={index}>
                    <td><Link to={'/dash/order/view/'+item.orderId}>{item.orderSn}</Link></td>
                    <td>{WebUtils.getTrimString(item.description,20)}</td>
                    <td>{item.eventTime}</td>
                </tr>);
            })
            orderEventHtml = <table><tbody>{trs}</tbody></table>;
        }

        let noteTitle = "最新公告";
        if(noteInfo){
            noteTitle += " - " + noteInfo.title;
        }

        if(this.getIsBaseAccess()){
            bodyHtml = 
            <div className="home-box">
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="card-box" style={{height:"300px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#2886fb",marginRight:"12px"}} type="audit"></Icon>订单信息</div>
                                <div className="card-head-right"><Link to='/dash/order'>更多</Link></div>
                            </div>
                            <div className="card-grid">
                                <div className="card-grid-row" style={{height:"160px"}}>                                    
                                    <OrderStatusTotal data={orderTotal[6]} />
                                    <OrderStatusTotal data={orderTotal[5]} />
                                </div> 
                                <div className="card-grid-row" style={{height:"100px"}}>                                    
                                    <OrderStatusTotal data={orderTotal[0]} />
                                    <OrderStatusTotal data={orderTotal[1]} />
                                    <OrderStatusTotal data={orderTotal[2]} />
                                    <OrderStatusTotal data={orderTotal[3]} />
                                    <OrderStatusTotal data={orderTotal[4]} />                                    
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
                                <Chart padding={[40,40]} forceFit height={300} data={this.state.userTotal}>
                                    <Tooltip />
                                    <Axis />
                                    <Legend position="top-center" />
                                    <Bar position="role*count" color="role" />
                                </Chart>
                            </div>
                        </div>                    
                    </Col>
                    <Col span={12}>
                        <div className="card-box" style={{height:"300px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#f95c06",marginRight:"12px"}} type="flag"></Icon>{noteTitle}</div>
                                <div className="card-head-right"><label>{noteInfo.createDate}</label></div>
                            </div>
                            <div className="card-content">
                                <div>{noteInfo.content}</div>                           
                            </div>
                        </div>
                        <div className="card-box" style={{marginTop:"20px"}}>
                            <div className="card-head">
                                <div className="card-head-left"><Icon style={{color:"#8c36c3",marginRight:"12px"}} type="rocket"></Icon>订单最新跟踪状态</div>
                                <div className="card-head-right"><label></label></div>
                            </div>
                            <div className="card-table" style={{height:"350px"}}>
                                {orderEventHtml}                          
                            </div>
                        </div>
                    </Col>                    
                </Row>
            </div>            
        }
        return(<Spin spinning={this.state.loading}>{bodyHtml}</Spin>)
    }
}
export default Index;