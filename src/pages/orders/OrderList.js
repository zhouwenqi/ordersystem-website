import React from 'react';
import { Form, Input, Button, Icon, Row, Message, Checkbox, Table } from 'antd';
import httpUtil from '../../utils/HttpUtils';
import webUtil from '../../utils/WebUtils';

import './order.css';

/**
 * 订单列表
 */
class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            pageInfo:{},
            dataSource:[],
            loading:false
        };
    }
    
    componentWillMount = () =>{   
            
        this.dataColumns = [
            {title:'晨颢工单',dataIndex:'sn',render:text=><a href="javascript:void(0)">{text}</a>},
            {title:'受理日期',dataIndex:'acceptDate'},
            {title:'订单类型',dataIndex:'orderType'},
            {title:'订单工期',dataIndex:'orderTime'},
            {title:'客户名称',dataIndex:'consumerName'},
            {title:'客户联系人',dataIndex:'consumerContact'},
            {title:'联系电话',dataIndex:'consumerPhone'},
            {title:'省',dataIndex:'province'},
            {title:'市',dataIndex:'city'},
            {title:'区',dataIndex:'area'},
            {title:'派单时间',dataIndex:'assignDate'},
            {title:'创建时间',dataIndex:'createDate'},
            {title:'操作',dataIndex:'',render:id=><a href="javascript:void(0)">删除</a>},
        ];
        this.dataSource = [
            {sn:'2020284',id:1,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},            
            {sn:'2020284',id:2,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'}
        ];
    }
    componentDidMount = ()=>{
        this.searchOrder();
    }
    searchOrder = ()=> {
        var base = this;
        var data = {
            params:{
                pageSize:base.state.pageSize,
                pageNumber:base.state.current
            }
        }
        
        base.setState({
            loading:true,
        })
        httpUtil.get("/api/order/search",data).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageCount};
                pagination.total = pageInfo.total;
                console.log("total:"+pagination.total);
                base.setState({
                    dataSource:response.list,
                    loading:false,
                    pageInfo:pagination,

                })
            }
        });
    }
    handleTableChange=(pageination,filters,sorter) => {
        const pager = {...this.state.pageInfo};
        pager.current = pageination.current;
        this.setState({
            pageInfo:pager,
        });
        this.searchOrder();
    }

    headerRowStyle=(column, index)=>{

    }   
    onRowClick=(record)=>({
        onDoubleClick:()=>{
            console.log(record);
        }
    });

    render = ()=> {
        return (
        <div className='grid-box'>
            <Table pagination={this.state.pageInfo} onChange={this.handleTableChange} onRow={this.onRowClick} rowKey="id" onHeaderRow={this.headerRowStyle} size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
        </div>);
    }
}

export default OrderList;