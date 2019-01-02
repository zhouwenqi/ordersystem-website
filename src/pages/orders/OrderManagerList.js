import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Modal, Button, Select, Icon, Row, Table, Col } from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import moment from 'moment';
import BasePage from '../BasePage';
import OrderType from '../../common/OrderType';
import OrderStatusDropDown from '../../components/OrderStatusDropDown';
import OrderSearchFrame from '../../components/OrderSearchForm';

import './order.css';

const Confirm = Modal.confirm;
const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;

/**
 * 后台管理 - 订单列表
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
            loading:false,
            isSearchShow:false,
        };
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
        editBtn = <Link to={'/dash/order/edit/'+record.id} className="item-a" title="修改"><Icon type="edit" theme="outlined" /></Link>;
        deleteBtn = <a className="item-a delete" onClick={this.deleteOrder.bind(this,record,record.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>
        
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
            {title:'状态',dataIndex:'orderStatus',render:(id,record)=>(<OrderStatusDropDown orderInfo={record} />)},
            {title:'操作',width:90,render:(id,record)=>(this.getOperationMenus(record))},
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
        const superSerachData = base.getSuperSerachData();
        const searchData = {...params,...superSerachData}
        HttpUtils.get("/api/order/search",{params:searchData}).then(function(response){
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
        const superSerachData = this.getSuperSerachData();
        const serachData = {...pagination,...superSerachData}
        let url = window.config.apiUrl+"/api/order/export?rand="+Math.random()*0.01+"&"+WebUtils.getUrlArgs(serachData);        
        url+="&ch-token="+window.config.token;
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
                pagination.pageNumber = 1;
                base.setState({
                    pageInfo:pagination
                });
                base.searchOrder(pagination);
            }
        });

    }
    /**
     * 启动高级查询
     */
    onStartSuperSearch=()=>{
        this.setState({
            isSearchShow:false,
        });
        var pager = {...this.state.pageInfo};
        this.searchOrder(pager);
    }
    /**
     * 获取高级查询参数
     */
    getSuperSerachData=()=>{
        const searchForm = this.searchForm.props.form; 
        let resultData = undefined;       
        searchForm.validateFields((err, values) => {
            if (err) {
                console.log(err);
                return;
            }
            
            if(values.createDate){
                const createDateBegin = values.createDate[0].format("YYYY-MM-DD") + "00:00:00";
                const createDateEnd = values.createDate[1].format("YYYY-MM-DD") + "59:59:59";
                values.createDateBegin = createDateBegin;
                values.createDateEnd = createDateEnd;
                values.createDate = undefined;
            }
            if(values.orderTime){
                const orderTimeBegin = values.orderTime[0].format("YYYY-MM-DD") + "00:00:00";
                const orderTimeEnd = values.orderTime[1].format("YYYY-MM-DD") + "59:59:59";
                values.orderTimeBegin = orderTimeBegin;
                values.orderTimeEnd = orderTimeEnd;
                values.orderTime = undefined;
            }
            if(values.areas){
                if(values.areas.length>2){
                    values.area= values.areas[2];
                }
                if(values.areas.length>1){
                    values.city= values.areas[1];
                }
                values.province = values.areas[0];
                values.areas = undefined;
            }
            resultData = values;
        });
        return resultData;
    }
    /**
     * 打开高级查询
     */
    onOpenSuperSearch=()=>{
        this.setState({
            isSearchShow:true,
        })
    }
    /**
     * 隐藏高级查询
     */
    onHiddenSuperSearch=()=>{
        this.setState({
            isSearchShow:false,
        })
    }
    /**
     * 获取高级查询表单
     */
    getOrderSearchForm=(searchForm)=>{
        this.searchForm = searchForm;
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
         <Select style={{minWidth:"120px"}}>
            <Option value="sn">订单号</Option>
            <Option value="uid">帐号</Option>
            <Option value="consumer_name">客户名称</Option>
            <Option value="consumer_contact">客户联系人</Option>
            <Option value="consumer_phone">联系电话</Option>
            <Option value="service_content">服务内容</Option>
            <Option value="requirement">订单要求</Option>
        </Select>);

        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关订单信息',
        }

        return (
            <div className='grid-box'>      
                <iframe src={this.state.excelUrl} />  
                <Form onSubmit={this.handleSubmit}>
                    <Row style={{margin:"0px 0px 10px 0px"}}>                  
                        <Col span={12}>
                            <InputGroup style={{width:"auto"}}>
                            {getFieldDecorator('searchValue',
                                {rules:[{required:false}]
                                })(                          
                                    <Search onSearch={this.handleSubmit} addonBefore={beforeSearchKeys} enterButton placeholder="请输入查询关键词" />                                   
                                )}
                            </InputGroup>  
                            <Button onClick={this.onOpenSuperSearch.bind(this)} style={{marginLeft:"10px"}}>高级查询</Button>                           
                        </Col>
                        <Col style={{textAlign:"right"}} offset={6} span={6}>                                          
                            <Button onClick={this.onExportExcel} icon="file-excel">导出Excel</Button>
                        </Col>
                    </Row>
                </Form>
                <OrderSearchFrame wrappedComponentRef={this.getOrderSearchForm.bind(this)} onCancel={this.onHiddenSuperSearch.bind(this)} onSearch={this.onStartSuperSearch.bind(this)} visible={this.state.isSearchShow} />
                <Table locale={locale} footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} onRow={this.onRowClick} rowKey="id" onHeaderRow={this.headerRowStyle} size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
            </div>);
    }
}
const OrderList = Form.create()(OrderListForm);
export default OrderList;