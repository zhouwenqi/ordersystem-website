import React from 'react';
import {
    Message,
    Row,
    Icon,
    Dropdown,
    Menu
} from 'antd';
import WebUtils from '../utils/WebUtils';
import OrderStatus from '../common/OrderStatus';
import HttpUtils from '../utils/HttpUtils';

class OrderStatusDropDown extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            orderInfo:this.props.orderInfo,
            status:false,
        };
    }   
    /**
     * 快速更新订单状态
     */
    onUpateOrderStatus=(status)=>{
        let orderInfo = this.state.orderInfo;
        const data = {
            orderStatus:status.key,
            id:orderInfo.id
        }
        const base = this;
        HttpUtils.post("/api/order/updateStatus",data).then(function(response){
            if(response){
                Message.success("订单状态更新成功");                
                orderInfo.orderStatus = status.key;
                base.setState({
                    orderInfo:orderInfo
                });
            }
        });
    }

    render=()=>{
        const order = this.state.orderInfo;
        let statusColor = WebUtils.getOrderStatusColor(order.orderStatus);
        const orderStatus = WebUtils.getEnumTag(OrderStatus,order.orderStatus);
        const subMenu = <Menu onClick={(sender)=>{this.onUpateOrderStatus(sender)}}>
            <Menu.Item key="pending">待派单</Menu.Item>
            <Menu.Item key="ongoing">跟进中</Menu.Item>
            <Menu.Item key="waitCheck">待验收</Menu.Item>
            <Menu.Item key="complete">已完结</Menu.Item>
            <Menu.Item key="cancel">已取消</Menu.Item>
        </Menu>
        return(
            <Dropdown overlay={subMenu}><Row><label color={statusColor} style={{cursor:"pointer",color:statusColor}}>{orderStatus}</label><Icon type="down" style={{marginLeft:"4px"}} /></Row></Dropdown>
        )
    }
}

export default OrderStatusDropDown;