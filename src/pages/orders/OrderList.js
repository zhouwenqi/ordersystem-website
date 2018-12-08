import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Modal, Button, Select, Icon, Row, Table, Col } from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import moment from 'moment';
import BasePage from '../BasePage';

import './order.css';
import OrderStatus from '../../common/OrderStatus';
import OrderType from '../../common/OrderType';
const Confirm = Modal.confirm;
const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;
/**
 * 客户 - 订单列表
 */
class OrderListForm extends BasePage {
    constructor(props,context) {
        super(props,context);
        this.state={
            pageInfo:{
                pageSize:20,
                current:1,
                total:0,
                sortField:"create_date",
                sortDirection:"desc"
            },       
            dataSource:[],
            excelUrl:undefined,
            loading:false
        };
    }

    /**
     * 返回列表中的订单状态
     */
    getOrderStatusSetup=(record)=>{        
        let statusColor = WebUtils.getOrderStatusColor(record.orderStatus);
        const orderStatus = WebUtils.getEnumTag(OrderStatus,record.orderStatus);
        return (<Row><label color={statusColor} style={{cursor:"pointer",color:statusColor}}>{orderStatus}</label></Row>);
    }

    /**
     * 返回列表中的订单类型
     */
    getOrderType=(record)=>{        
        const orderType = WebUtils.getEnumTag(OrderType,record.orderType);
        return (<label>{orderType}</label>);
    }

    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        let viewBtn = <Link className="item-a" to={'/dash/order/view/'+record.id} title="查看订单详情"><Icon type="ellipsis" theme="outlined" /></Link>;
        var editBtn,deleteBtn;
        if(record && record.orderStatus==="pending"){
            editBtn = <Link to={'/dash/order/edit/'+record.id} className="item-a" title="修改"><Icon type="edit" theme="outlined" /></Link>;
            deleteBtn = <a className="item-a delete" onClick={this.deleteOrder.bind(this,record,record.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>
        }
        return (<Row>{viewBtn}{editBtn}{deleteBtn}</Row>);
    }
    
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'晨颢工单',sorter: true,dataIndex:'sn',render:(id,record)=>(<Link to={'/dash/order/view/'+record.id}>{record.sn}</Link>)},
            {title:'订单类型',sorter: true,dataIndex:'orderType',render:(id,record)=>(this.getOrderType(record))},
            {title:'订单工期',sorter: true,dataIndex:'orderTime'},
            {title:'客户名称',sorter: true,dataIndex:'consumerName'},
            {title:'客户联系人',sorter: true,dataIndex:'consumerContact'},
            {title:'联系电话',sorter: true,dataIndex:'consumerPhone'},           
            {title:'地区',sorter: true,dataIndex:'area'},
            {title:'派单时间',sorter: true,dataIndex:'assignDate',render:(text)=>(moment(text).format("YYYY-MM-DD"))},
            {title:'创建时间',sorter: true,dataIndex:'createDate',defaultSortOrder: 'descend'},
            {title:'状态',dataIndex:'orderStatus',render:(id,record)=>(this.getOrderStatusSetup(record))},
            {title:'操作',dataIndex:'',render:(id,record)=>(this.getOperationMenus(record))},
        ];
    }
    componentDidMount = ()=>{
        this.searchOrder(this.state.pageInfo);
    }
    /**
     * 删除订单
     */
    deleteOrder = (record,id)=>{
        const base = this;
        Confirm({
            title: '删除此订单',
            content: '确定要删除这张订单吗？',
            onOk() {
                var params = {id:id};
                HttpUtils.delete("/api/order/delete",{params:params}).then(function(response){
                    if(response){
                        var items = base.state.dataSource;                        
                        for(var i=0;i<items.length;i++){                            
                            if(items[i].id===id){
                                items.splice(i,1);
                            }
                        }
                        base.setState({
                            dataSource:items,
                        })
                    }
                });
            },
            onCancel() {},
          });
        
    }
    /**
     * 订单查询
     */
    searchOrder = (params = {})=> {
        const base = this;       
        base.setState({
            loading:true,
        });

        HttpUtils.get("/api/order/search",{params:params}).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageInfo};
                pagination.total = pageInfo.total;
                pagination.current = pageInfo.pageNumber;                
                base.setState({
                    dataSource:response.list,
                    loading:false,
                    pageInfo:pagination,
                })
            }
        });
    }

    /**
     * 导出excel
     */
    onExportExcel=(e)=>{
        var pagination = {...this.state.pageInfo};
        pagination.pageNumber = 1;
        pagination.pageSize = null;
        let url = window.config.apiUrl+"/api/order/export?rand="+Math.random()*0.01+"&"+WebUtils.getUrlArgs(pagination);        
        url+="&ch-token="+window.config.token;
        console.log("url",url);
        this.setState({
            excelUrl:url
        })
    }

    /**
     * 切换页码
     */
    handleTableChange=(pagination,filters,sorter) => {        
        var pager = {...this.state.pageInfo};
        pager.current = pagination.current;
        pager.pageNumber = pagination.current;
        if(sorter.field){
            pager.sortDirection = sorter.order.replace("end","");
            pager.sortField = WebUtils.getHumpString(sorter.field);
        }else{
            pager.sortDirection = "desc";
            pager.sortField = "create_date"
        }
        
        this.setState({
            pageInfo:pager,            
        })
        this.searchOrder(pager);

    }

    /**
     * 提交查询条件
     */
    handleSubmit=(e,event)=>{
        event.preventDefault();
        const base = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var pagination = {...base.state.pageInfo};
                pagination.searchProperty = values.searchProperty;
                pagination.searchValue = values.searchValue;
                pagination.pageNumber = 1
                base.setState({
                    pageInfo:pagination
                });
                base.searchOrder(pagination);
            }
        });

    }

    /**
     * 表格点击事件
     */
    onRowClick=(record)=>({
        // 双击事件
        onDoubleClick:()=>{
            console.log(record);
        }
    });

    getTableFooter=()=>{
        const base = this;
        return (<label>共找到<span style={{color:"#1890ff"}}> {base.state.pageInfo.total} </span>条订单数据</label>);
    }

    render=()=>{
        const {getFieldDecorator} = this.props.form;        
        const beforeSearchKeys = getFieldDecorator("searchProperty",{initialValue:"sn"})(
         <Select>
            <Option value="sn">订单号</Option>
            <Option value="consumer_name">客户名称</Option>
            <Option value="consumer_contact">客户联系人</Option>
            <Option value="consumer_phone">联系电话</Option>
        </Select>);

        return (
            <div className='grid-box'>
                <iframe src={this.state.excelUrl} />
                <Form onSubmit={this.handleSubmit}>
                    <Row style={{margin:"0px 0px 10px 0px"}}>
                        <Col span={6}>
                            <InputGroup>
                            {getFieldDecorator('searchValue',
                                {rules:[{required:false}]
                                })(                          
                                    <Search onSearch={this.handleSubmit} addonBefore={beforeSearchKeys} enterButton placeholder="请输入查询关键词" />
                                )}
                            </InputGroup>
                        </Col>
                        <Col style={{textAlign:"right"}} offset={12} span={6}>                        
                            <Button onClick={this.onExportExcel} icon="file-excel">导出Excel</Button>
                        </Col>
                    </Row>
                </Form>
                <Table footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} onRow={this.onRowClick} rowKey="id" onHeaderRow={this.headerRowStyle} size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
            </div>
        );
    }
}
const OrderList = Form.create()(OrderListForm);
export default OrderList;