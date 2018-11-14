import React from 'react';
import { Form, Input, Button, Icon, Row, Message, Checkbox, Table } from 'antd';

import './order.css';

/**
 * 订单列表
 */
class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            pageIndex:1,
            pageSize:10
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
            {title:'省',dataIndex:'provice'},
            {title:'市',dataIndex:'city'},
            {title:'区',dataIndex:'area'},
            {title:'派单时间',dataIndex:'assignDate'},
            {title:'创建时间',dataIndex:'createDate'},
            {title:'操作',dataIndex:'',render:id=><a href="javascript:void(0)">删除</a>},
        ];
        this.dataSource = [
            {sn:'2020284',id:1,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},            
            {sn:'2020284',id:2,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:3,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:4,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:5,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:6,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:7,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:8,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:9,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:10,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:11,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:12,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:13,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:14,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:15,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:16,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:17,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:18,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:19,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},            
            {sn:'2020284',id:20,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:21,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:22,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:23,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:24,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:25,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:26,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:27,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:28,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:29,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:30,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:31,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:32,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:33,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:34,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:35,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:36,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:37,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},            
            {sn:'2020284',id:38,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:39,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:40,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:41,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:42,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:43,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:44,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:45,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:46,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:47,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:48,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:49,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:50,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:51,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:52,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:53,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
            {sn:'2020284',id:54,acceptDate:'2018/11/9 13:29:33',orderType:'监控检修',orderTime:'2018/20/12',consumerName:'apple',consumerContact:'zhouwenqi',consumerPhone:'18665111530',provice:'广东省',city:'深圳市',area:'罗湖区',assignDate:'2018/12/1 13:38:50',createDate:'2018/10/1 14:23:42'},
        ];
    }
    headerRowStyle=(column, index)=>{

    }   
    onRowClick=(record)=>({
        onDoubleClick:()=>{
            console.log(record);
        }
    });
    
    gotoPage=(current,pageSize)=>{
        this.setState({
            pageIndex:current,
            pageSize:pageSize
        });
    }

    render = ()=> {
        var self = this;
        const pageable = {
            pageSize:self.state.pageSize,
            total:self.dataSource.length,
            current:self.state.pageIndex,
            showSizeChanger:true,
            onChange:(current)=>{
                self.gotoPage(current,self.state.pageSize);
            },
            onShowSizeChange:function(current,pageSize){
                self.gotoPage(current,pageSize);
            }
        }
        return (
        <div className='grid-box'>
            <Table pagination={pageable} onRow={this.onRowClick} rowKey="id" onHeaderRow={this.headerRowStyle} size="small" columns={this.dataColumns} dataSource={this.dataSource} bordered />
        </div>);
    }
}

export default OrderList;