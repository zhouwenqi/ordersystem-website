import React from 'react';
import { Link } from 'react-router-dom';
import { Spin, Tabs, Message, Icon, Col,Row,Button,Breadcrumb, Table } from 'antd';
import Moment from 'moment';
import OrderType from '../../common/OrderType';
import OrderStatus from '../../common/OrderStatus';
import PaymentStatus from '../../common/PaymentStatus';
import PaymentMethod from '../../common/PaymentMethod';
import httpUtils from '../../utils/HttpUtils';
import BasePage from '../BasePage';
import WebUtils from '../../utils/WebUtils';
import HttpUtils from '../../utils/HttpUtils';

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
            isAdmin:false,
            orderInfo:{},
            pageInfo:{
                pageSize:20,
                current:1,
                total:0,
                sortField:"create_date",
                sortDirection:"desc",                
            },       
            dataSource:[],
        }
    }
    componentWillMount = () =>{
        // 文件表格列头
        this.dataColumns = [
            {title:'文件名',sorter: true,dataIndex:'name',render:(text,render)=>(this.getFileNameCell(text,render))},
            {title:'文件路径',sorter: true,dataIndex:'path'},
            {title:'文件类型',sorter: true,dataIndex:'fileType'},
            {title:'关联订单', width:200,sorter: true,dataIndex:'orderSn'},
            {title:'上传用户',sorter: true,dataIndex:'uid'},
            {title:'下载次数', width:100,sorter: true,dataIndex:'uploadCount'},
            {title:'上传时间',width:160,sorter: true,dataIndex:'createDate'},
            {title:'下载',width:60,render:(record)=>(this.getOperationMenus(record))}
        ];
    }
    componentDidMount =() =>{       
        this.getOrderInfo();
    }
    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        let downBtn = <a className="item-a edit" href="javascript:;" title="下载"><Icon type="cloud-download" theme="outlined" /></a>;        
        return (<Row>{downBtn}</Row>);
    }
    getFileNameCell(text,record){
        console.log(record);
        return (<a href={record.path}>{text}</a>);
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
                let isAdmin = false;
                let isOrderEdit = response.order.orderStatus==='pending';
                if(user.role==='manager' || user.role==='employee'){
                    isOrderEdit = true;
                    isAdmin = true;
                }                
                base.setState({                    
                    orderInfo:response.order, 
                    loading:false,
                    isEdit:isOrderEdit,
                    isAdmin:isAdmin         
                });
                base.searchFile();
            }else{
                base.setState({
                    loading:false
                });
            }            
        });
    }

    /**
     * 查询订单项目文件
     */
    searchFile=(params={})=>{
        const base = this;
        params.orderId = this.state.orderInfo.id;
        HttpUtils.get("/api/order/file/list",{params:params}).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageInfo};
                pagination.total = pageInfo.total;
                pagination.current = pageInfo.pageNumber;                
                base.setState({
                    dataSource:response.list,
                    pageInfo:pagination,
                })
            }
        });
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
        this.searchFile(pager);
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

    /**
     * 文件列表Table脚注
     */
    getTableFooter=()=>{
        const base = this;
        return (<label>共找到<span style={{color:"#1890ff"}}> {base.state.pageInfo.total} </span>条文件信息</label>);
    }

    render=()=>{
        const order = this.state.orderInfo;
        let branchUser = undefined;
        if(order.branch){
            if(order.branch.user){
                branchUser = order.branch.user;
            }
        }
        let viewContent = undefined;        
        // Tabs 扩展Button        
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" onClick={this.onBack}></Button>
                <Button icon="edit" onClick={this.onEdit} disabled={!this.state.isEdit}>修改</Button>
            </ButtonGroup>
        );

        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关上传文件',
        }

        if(order.sn!=undefined){   

            // 订单详情
            let TabPaneMore = undefined;     
            // 订单帐号信息
            let TabPanePayment = undefined;
            // 订单实时状态
            let TabPaneEvent = undefined;
            // 订单项目文件
            let TabPaneFile = undefined;
            if(this.state.isAdmin){
                TabPaneMore = <TabPane tab="详细信息" key="more-info">
                    <div className="view-box">
                        <table className="view-table">
                            <tbody>
                                <tr>
                                    <th>项目跟进人：</th>
                                    <td><span>{WebUtils.getViewUserName(order.traceUser)}</span></td>
                                    <th>每路价格：</th>
                                    <td><span className="num">￥{order.routePrice}</span></td>
                                </tr>
                                <tr>
                                    <th>网点：</th>
                                    <td><span>{order.branch?order.branch.name:undefined}</span></td>
                                    <th>总价格：</th>
                                    <td><span className="num">￥{order.totalPrice}</span></td>
                                </tr>
                                <tr>
                                    <th>网点负责人：</th>
                                    <td><span>{WebUtils.getViewUserName(branchUser)}</span></td>
                                    <th>厂商其它费用：</th>
                                    <td><span className="num">￥{order.otherPrice}</span></td>
                                </tr>
                                <tr>
                                    <th>上门工程师：</th>
                                    <td><span>{WebUtils.getViewUserName(order.traceUser)}</span></td>
                                    <th>厂商其它费用说明：</th>
                                    <td><span>{order.otherPriceDescription}</span></td>
                                </tr>
                                <tr>
                                    <th>联系电话：</th>
                                    <td><span>{order.traceUser?order.traceUser.phone:undefined}</span></td>
                                    <th>实际总额：</th>
                                    <td><span className="num">￥{order.actualPrice}</span></td>
                                </tr>
                                <tr>
                                    <th>邮箱：</th>
                                    <td><span>{order.traceUser?order.traceUser.email:undefined}</span></td>
                                    <th>每路服务费用：</th>
                                    <td><span className="num">￥{order.routeServicePrice}</span></td>
                                </tr>
                                <tr>
                                    <th rowSpan="4"></th>
                                    <td rowSpan="4"></td>
                                    <th>与网点结算价格：</th>
                                    <td><span className="num">￥{order.branchBalancePrice}</span></td>
                                </tr>
                                <tr>
                                    <th>网点其它费用：</th>
                                    <td><span className="num">￥{order.branchOtherPrice}</span></td>
                                </tr>
                                <tr>
                                    <th>网点其它费用说明：</th>
                                    <td><span>{order.branchOtherPriceDescription}</span></td>
                                </tr>
                                <tr>
                                    <th>实际付款金额：</th>
                                    <td><span className="num">￥{order.actualPaymentPrice}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </TabPane>;

                TabPanePayment = <TabPane tab="帐务信息" key="payment-info">
                    <div className="view-box">
                        <table className="view-table">
                            <tbody>
                                <tr>
                                    <th>网点收款户名：</th>
                                    <td><span>{order.bankAccountName}</span></td>
                                    <th>付款方式：</th>
                                    <td><span>{WebUtils.getEnumTag(PaymentMethod,order.paymentMethod)}</span></td>
                                </tr>
                                <tr>
                                    <th>网点收款银行帐号：</th>
                                    <td><span>{order.bankAccountCode}</span></td>
                                    <th>是否已对帐：</th>
                                    <td><span>{order.isChecked?'是':'否'}</span></td>
                                </tr>
                                <tr>
                                    <th>收款行支行名称：</th>
                                    <td><span>{order.bankName}</span></td>
                                    <th>对帐时间：</th>
                                    <td><span>{order.checkedDate?Moment(order.checkedDate).format("YYYY-MM-DD"):undefined}</span></td>
                                </tr>
                                <tr>
                                    <th>请款状态：</th>
                                    <td><span>{WebUtils.getEnumTag(PaymentStatus,order.paymentStatus)}</span></td>
                                    <th>是否已开票：</th>
                                    <td><span>{order.isInvoice?'是':'否'}</span></td>
                                </tr>
                                <tr>
                                    <th>财务付款日期：</th>
                                    <td><span>{order.paymentTime}</span></td>
                                    <th>开票时间：</th>
                                    <td><span>{order.invoiceDate?Moment(order.invoiceDate).format("YYYY-MM-DD"):undefined}</span></td>
                                </tr>
                                <tr>
                                    <th rowSpan="2">备注：</th>
                                    <td rowSpan="2"><span>{order.memo}</span></td>
                                    <th>是否已回款：</th>
                                    <td><span>{order.isRefunds?'是':'否'}</span></td>
                                </tr>
                                <tr>
                                    <th>回款时间：</th>
                                    <td><span>{order.refundsDate?Moment(order.refundsDate).format("YYYY-MM-DD"):undefined}</span></td>
                                </tr>
                            </tbody>                            
                        </table>
                    </div>
                </TabPane>;

                TabPaneFile = <TabPane tab="项目文件" key="file-info">
                    <div className="grid-box">
                        <Table locale={locale} footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
                    </div>
                </TabPane>;
            }

            let OrderEvents = [];
            if(order.orderEvents.length>0){
                order.orderEvents.map((item,index)=>{
                    OrderEvents.push(
                        <tr key={index}>
                            <td>{item.orderSn}</td>
                            <td>{item.realName}({item.uid})</td>
                            <td>{item.description}</td>
                            <td>{Moment(item.eventTime).format("YYYY-MM-DD")}</td>
                        </tr>
                    )
                });
            }else{
                OrderEvents.push(
                    <tr key="0">
                        <td colSpan="4" style={{padding:"20px",textAlign:"center"}}>没有相关动态</td>
                    </tr>
                )

            }
            TabPaneEvent = <TabPane tab="实时状态" key="event-info">
                <div className="view-box">
                    <table className="view-table">
                        <thead>
                            <tr>
                                <td style={{width:"200px"}}>订单编号</td>
                                <td style={{width:"200px"}}>帐号</td>
                                <td>状态描述</td>
                                <td style={{width:"200px"}}>时间</td>
                            </tr> 
                        </thead>
                        <tbody>
                            {OrderEvents}
                        </tbody>
                    </table>
                </div>
            </TabPane>

            viewContent = <div className="grid-form" style={{padding:"10px 0px"}}><Tabs tabBarExtraContent={extOperations} type="card">
                <TabPane tab="订单信息" key="basic-info">
                    <div className="view-box">
                        <table className="view-table">
                            <tbody>
                                <tr>
                                    <th>订单编号：</th>
                                    <td><span style={{fontWeight:"bold",color:"#222222"}}>{order.sn}</span></td>
                                    <th>订单状态：</th>
                                    <td><span style={{color:WebUtils.getOrderStatusColor(order.orderStatus)}}>{WebUtils.getEnumTag(OrderStatus,order.orderStatus)}</span></td>
                                </tr>
                                <tr>
                                    <th>订单来源：</th>
                                    <td><span>{WebUtils.getViewUserName(order.orderUser)}</span></td>
                                    <th>创建时间：</th>
                                    <td><span>{order.createDate}</span></td>
                                </tr>
                                <tr>
                                    <th>订单类型：</th>
                                    <td><span>{WebUtils.getEnumTag(OrderType,order.orderType)}</span></td>
                                    <th>修改时间：</th>
                                    <td><span>{order.editDate}</span></td>
                                </tr>
                                <tr>
                                    <th>订单工期：</th>
                                    <td><span>{order.orderTime}</span></td>
                                    <th rowSpan="4">服务内容：</th>
                                    <td rowSpan="4"><span dangerouslySetInnerHTML={{__html:WebUtils.getReaplceChar(order.serviceContent)}}></span></td>
                                </tr>
                                <tr>
                                    <th>派单日期：</th>
                                    <td><span>{Moment(order.assignDate).format("YYYY-MM-DD")}</span></td>                                
                                </tr>
                                <tr>
                                    <th>客户名称：</th>
                                    <td><span>{order.consumerName}</span></td>                                
                                </tr>
                                <tr>
                                    <th>客户联系人：</th>
                                    <td><span>{order.consumerContact}</span></td>                                
                                </tr>
                                <tr>
                                    <th>联系电话：</th>
                                    <td><span>{order.consumerPhone}</span></td>
                                    <th rowSpan="4">订单要求：</th>
                                    <td rowSpan="4"><span dangerouslySetInnerHTML={{__html:WebUtils.getReaplceChar(order.requirement)}}></span></td>
                                </tr>
                                <tr>
                                    <th>省/市/区：</th>
                                    <td><span>{order.province}-{order.city}-{order.area}</span></td>                                
                                </tr>
                                <tr>
                                    <th>安装地址：</th>
                                    <td><span>{order.address}</span></td>                                
                                </tr>
                                <tr>
                                    <th>安装路数：</th>
                                    <td><span className="num">{order.routeQuantity}</span></td>                               
                                </tr>
                            </tbody>
                        </table>                        
                    </div>
                </TabPane>
                {TabPaneMore}
                {TabPanePayment}
                {TabPaneEvent}
                {TabPaneFile}
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