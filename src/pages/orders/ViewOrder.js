import React from 'react';
import { Link } from 'react-router-dom';
import { Spin, Tabs, Message, Col,Row,Button,Breadcrumb } from 'antd';
import moment from 'moment';
import httpUtils from '../../utils/HttpUtils';
import BasePage from '../BasePage';
import WebUtils from '../../utils/WebUtils';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
/**
 * 查看订单
 */
class ViewOrder extends BasePage {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
            isEdit:false,        
            orderInfo:{}
        }
    }
    componentDidMount =() =>{
        this.getOrderInfo();
    }
    /**
     * 请求接口获取订单信息
     */
    getOrderInfo=()=>{
        const base = this;
        base.setState({
            loading:true,
        });
        let params={
            id:base.props.match.params.id
        }
        httpUtils.get("/api/order/info",{params:params}).then(function(response){
            if(response){
                const user = window.config.user;
                let isOrderEdit = response.order.orderStatus==='pending';
                if(user.role==='manager' || user.role==='employee'){
                    isOrderEdit = true;
                }                
                base.setState({                    
                    orderInfo:response.order, 
                    loading:false,
                    isEdit:isOrderEdit             
                });
            }else{
                base.setState({
                    loading:false
                });
            }
            
        });
    }
    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }
    /**
     * 编辑
     */
    onEdit=()=>{
        let id = this.props.match.params.id;
        this.props.history.push("/dash/order/edit/"+id);
    }
    render=()=>{
        const order = this.state.orderInfo;
        let viewContent = undefined;
        
        // Tabs 扩展Button        
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" onClick={this.onBack}></Button>
                <Button icon="edit" onClick={this.onEdit} disabled={!this.state.isEdit}>修改</Button>
            </ButtonGroup>
        )
        if(order.sn!=undefined){
            viewContent = <div className="grid-form" style={{padding:"10px 0px"}}><Tabs tabBarExtraContent={extOperations} type="card">
                <TabPane tab="订单信息" key="basic-info">
                    <div className="view-box">   
                        <Col span={8}>
                            <Row><label>订单编号：</label><span style={{fontWeight:"bold",color:"#222222"}}>{order.sn}</span></Row>
                            <Row><label>订单来源：</label><span>{order.orderUser.realName}({order.orderUser.uid})</span></Row>
                            <Row><label>订单类型：</label><span>{order.orderType}</span></Row>
                            <Row><label>订单工期：</label><span>{order.orderTime}</span></Row>
                            <Row><label>派单日期：</label><span>{moment(order.assignDate).format("YYYY-MM-DD")}</span></Row>
                            <Row><label>客户名称：</label><span>{order.consumerName}</span></Row>
                            <Row><label>客户联系人：</label><span>{order.consumerContact}</span></Row>
                            <Row><label>联系电话：</label><span>{order.consumerPhone}</span></Row>
                            <Row><label>省/市/区：</label><span>{order.province}-{order.city}-{order.area}</span></Row>
                            <Row><label>联系地址：</label><span>{order.address}</span></Row>
                        </Col>
                        <Col span={16}>
                            <Row><label>订单状态：</label><span style={{color:WebUtils.getOrderStatusColor(order.status)}}>{order.orderStatus}</span></Row>
                            <Row><label>创建时间：</label><span>{order.createDate}</span></Row>
                            <Row><label>修改时间：</label><span>{order.editDate}</span></Row>
                            <Row><label>服务内容：</label><span dangerouslySetInnerHTML={{__html:WebUtils.getReaplceChar(order.serviceContent)}}></span></Row>
                            <Row><label>订单要求：</label><span dangerouslySetInnerHTML={{__html:WebUtils.getReaplceChar(order.requirement)}}></span></Row>
                        </Col> 
                    </div>
                </TabPane>
            </Tabs></div>;
        }
        return(
            <Spin spinning={this.state.loading}>
                <Breadcrumb style={{marginTop:"10px"}}>
                    <Breadcrumb.Item>控制台</Breadcrumb.Item>
                    <Breadcrumb.Item>我的订单</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/dash/order">订单列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>查看订单</Breadcrumb.Item>
                </Breadcrumb>
                {viewContent}   
            </Spin>
        );
    }
}

export default ViewOrder;