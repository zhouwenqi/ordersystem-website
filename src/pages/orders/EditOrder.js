import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,Upload,
     Icon, Row, Message, Checkbox,Table,
     Cascader, DatePicker,Col,Modal,Divider,
     Select,InputNumber,Breadcrumb
} from 'antd';
import Moment from 'moment';
import AreaData from '../../common/AreaData';
import OrderType from '../../common/OrderType';
import OrderStatus from '../../common/OrderStatus';
import PaymentStatus from '../../common/PaymentStatus';
import PaymentMethod from '../../common/PaymentMethod';
import HttpUtils from '../../utils/HttpUtils';
import BasePage from '../BasePage';
import axios from 'axios';
import './order.css';
import WebUtils from '../../utils/WebUtils';
import ChSearch from '../../components/ChSearch';
import OrderStatusFragment from '../../components/OrderStatusForm';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const ButtonGroup = Button.Group;
const Confirm = Modal.confirm;

const formItemLayout = {
    labelCol: {
      xs: { span: 18 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 14 },
    },
};

/**
 * 编辑订单
 */
class EditOrderForm extends BasePage {
    constructor(props,context) {
        super(props,context);       
        this.onChangeTotalPrice = this.onChangeTotalPrice.bind(this); 
    }  
    state = {
        loading:false,
        customerData:[],
        trackData:[],
        branchData:[], 
        enginnerData:[],
        orderEvents:[],
        currentBranch:undefined,          
        customerValue:undefined,
        currentEnginner:undefined,
        isAdmin:false,
        isEdit:false,
        isFollow:false,
        isNeedTraceUser:false,
        orderInfo:undefined,
        orderUserId:undefined,
        isChecked:false,
        isInvoice:false,
        isRefunds:false,   
        statusFrameShow:false,
        loadingStatus:false,
        pageProjectInfo:{
            pageSize:20,
            current:1,
            total:0,
            sortField:"create_date",
            sortDirection:"desc",                
        }, 
        pageCheckInfo:{
            pageSize:20,
            current:1,
            total:0,
            sortField:"create_date",
            sortDirection:"desc",                
        },       
        downloadUrl:undefined,
        projectFileSource:[],
        checkFileSource:[],
    }
    static contextTypes = {
        menuRoute:PropTypes.func
    }   
    componentWillMount = () =>{
        // 文件表格列头
        this.dataColumns = [
            {title:'文件名',sorter: true,dataIndex:'name',render:(text,record)=>(this.getFileNameCell(text,record))},
            {title:'文件路径',sorter: true,dataIndex:'path'},
            {title:'扩展名',sorter: true,dataIndex:'fileSuffix'},
            {title:'关联订单', width:200,sorter: true,dataIndex:'orderSn'},
            {title:'上传用户',sorter: true,dataIndex:'uid'},
            {title:'下载次数', width:100,sorter: true,dataIndex:'uploadCount'},
            {title:'上传时间',width:160,sorter: true,dataIndex:'createDate',defaultSortOrder: 'descend'},
            {title:'操作',width:100,render:(record)=>(this.getOperationMenus(record))}
        ];
    } 
    componentDidMount =() =>{        
        this.getOrderInfo();        
    }
    getFileNameCell(text,record){
        return (<a href="javascript:;" onClick={this.onDownloadFile.bind(this,record.id)}>{text}</a>);
    }
    /**
     * 返回项目文件列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        let downBtn = <a className="item-a edit" onClick={this.onDownloadFile.bind(this,record.id)} href="javascript:;" title="下载"><Icon type="cloud-download" theme="outlined" /></a>;        
        let deleteBtn = <a className="item-a delete" onClick={this.onDeleteFile.bind(this,record.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>;        
        return (<Row>{downBtn}{deleteBtn}</Row>);
    }
    getUploadConfig=(fileType)=>{
        /**
         * 上传文件
         */
        const base = this;
        const uploadProps = {
            name: 'file',
            action: window.config.apiUrl+'/api/order/file/upload?orderId='+this.state.orderInfo.id+"&fileType="+fileType,
            headers: {
                "ch-token": window.config.token,
            },
            onChange(info) {
                console.log(info);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    const response = info.file.response;                    
                    if(response){
                        if(response.code===200){
                            Message.success(`${info.file.name} 文件上传成功`);
                            if(fileType==='PROJECT'){
                                base.searchProjectFile(base.state.pageProjectInfo);
                            }else if(fileType==='CHECK'){
                                base.searchCheckFile(base.state.pageCheckInfo);
                            }
                            
                        }else{
                            Message.error(`${info.file.name} 文件上传失败 ${response.msg}`);
                        }
                    }else{
                        Message.error(`${info.file.name} 文件上传失败`);
                    }                    
                    
                } else if (info.file.status === 'error') {
                    Message.error(`${info.file.name} 文件上传失败`);
                }
            },
        };
        return uploadProps;
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
        HttpUtils.get("/api/order/info",{params:params}).then(function(response){
            const user = window.config.user;
            if(response){  
                const orderInfo = response.order; 
                let isAdmin = false;
                let isOrderEdit = orderInfo.orderStatus === 'pending';
                if(user.role==='manager' || user.role==='employee' || user.role==='follow'){
                    isOrderEdit = true;
                    isAdmin = true;
                }        
                const isFollow = user.role==='follow';
                base.setState({                    
                    orderInfo:orderInfo,
                    loading:false,
                    orderUserId:orderInfo.orderUserId,
                    currentBranch:orderInfo.branch,
                    currentEnginner:orderInfo.enginnerUser,
                    orderEvents:orderInfo.orderEvents,
                    isEdit:isOrderEdit,
                    isAdmin:isAdmin,
                    isFollow:isFollow,
                    isChecked:orderInfo.isChecked,
                    isInvoice:orderInfo.isInvoice,
                    isRefunds:orderInfo.isRefunds,
                });   
                
                if(user.role==='manager' || user.role==='employee' || user.role==='follow'){                
                    // 获取网点数据
                    const branchParams = {province:orderInfo.province,city:orderInfo.city};
                    let requests = [HttpUtils.get("/api/branch/search",{params:branchParams})];
                    // 获取项目跟进人数据
                    const trackParams = {role:"follow"};               
                    requests.push(HttpUtils.get("/api/user/list",{params:trackParams}));
                    axios.all(requests).then(axios.spread(function(branchData,trackData){
                        let branchList = [];
                        if(orderInfo.province || orderInfo.city || orderInfo.area){
                            branchList = branchData.list;
                        }
                        base.setState({
                            trackData:trackData.list,
                            branchData:branchList
                        });
                        // 获取上门工程师数据
                        if(orderInfo.branchId){
                            base.getEnginnerList(orderInfo.branchId);
                        }                        
                    })); 
                    
                    
                }
            }else{
                base.setState({
                    loading:false
                });
            }
        });
    }

    /**
     * 获取网点数据
     */
    onGetBranchList=(areas)=>{
        const base = this;
        const params={params:areas}
        HttpUtils.get('/api/branch/search',params).then(function(response){
            base.setState({
                branchData:response.list
            });
        });
    }

    /**
     * 选择地区
     */
    onAreaChange=(e)=>{
        let areas = {
            province:undefined,
            city:undefined,
        }
        if(e.length>1){
            areas.province = e[0];
            areas.city = e[1];
        }
        if(e.length===2){
            this.onGetBranchList(areas);
        }
        
    }

    /**
     * 查询订单项目文件
     */
    searchProjectFile=(params={})=>{
        const base = this;
        params.orderId = this.state.orderInfo.id;
        params.fileType = "PROJECT";
        HttpUtils.get("/api/order/file/list",{params:params}).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageProjectInfo};
                pagination.total = pageInfo.total;
                pagination.current = pageInfo.pageNumber;                
                base.setState({
                    projectFileSource:response.list,
                    pageProjectInfo:pagination,
                })
            }
        });
    }

    /**
     * 查询订单验收文件
     */
    searchCheckFile=(params={})=>{
        const base = this;
        params.orderId = this.state.orderInfo.id;
        params.fileType="CHECK";
        HttpUtils.get("/api/order/file/list",{params:params}).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageCheckInfo};
                pagination.total = pageInfo.total;
                pagination.current = pageInfo.pageNumber;                
                base.setState({
                    checkFileSource:response.list,
                    pageCheckInfo:pagination,
                })
            }
        });
    }

    /**
     * 项目文件切换页码
     */
    handleProjectChange=(pagination,filters,sorter) => {        
        var pager = {...this.state.pageProjectInfo};
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
            pageProjectInfo:pager,            
        })
        this.searchProjectFile(pager);
    }
    /**
     * 难收文件切换页码
     */
    /**
     * 切换页码
     */
    handleCheckChange=(pagination,filters,sorter) => {        
        var pager = {...this.state.pageCheckInfo};
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
            pageCheckInfo:pager,            
        })
        this.searchCheckFile(pager);
    }
    /**
     * 文件列表Table脚注
     */
    getTableFooter=(key)=>{
        if(key==='project-file-info'){
            return (<label>共找到<span style={{color:"#1890ff"}}> {this.state.pageProjectInfo.total} </span>条项目文件信息</label>);
        }else if(key==='check-file-info'){
            return (<label>共找到<span style={{color:"#1890ff"}}> {this.state.pageCheckInfo.total} </span>条验收文件信息</label>);
        }        
    }

    /**
     * Tab切换事件
     */
    onTabChangeHandler=(key)=>{
        const base = this;
        if(key==='project-file-info'){
            base.searchProjectFile(base.state.pageInfo);
        }else if(key==='check-file-info'){
            base.searchCheckFile(base.state.pageInfo);
        }
        console.log(key);
    }

    /**
     * 下载文件
     */
    onDownloadFile=(fileId)=>{
        let url = window.config.apiUrl;
        url += "/api/order/file/download?ch-token="+window.config.token+"&fileId="+fileId+"&rnd="+Math.random()*0.01;
        console.log(url);
        this.setState({
            downloadUrl:url
        })
    }

    /**
     * 删除文件
     */
    onDeleteFile=(fileId)=>{
        Confirm({
            title:"删除文件",
            content:"确定要删除这个文件吗？",
            onOk:()=>{
                const data = {id:fileId};
                const base = this;
                HttpUtils.post('/api/order/file/delete',data).then(function(response){
                    base.searchFile(base.state.pageInfo);
                });
            },
            onCancel:()=>{

            }
        })
    }


    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.submitOrder(values);
            }            
        });
    }

    /**
     * 提交订单
     */
    submitOrder = (data) =>{
        data.assignDate = data.assignDate.format("YYYY-MM-DD");        
        if(data.areas.length>0){
            data.province = data.areas[0];
        }
        if(data.areas.length>1){
            data.city = data.areas[1];
        }
        if(data.areas.length>2){
            data.area = data.areas[2];
        }
        if(data.paymentTime){
            data.paymentTime = data.paymentTime.format("YYYY-MM-DD");
        }
        if(data.checkedDate){
            data.checkedDate = data.checkedDate.format("YYYY-MM-DD");
        }
        if(data.invoiceDate){
            data.invoiceDate = data.invoiceDate.format("YYYY-MM-DD");
        }
        if(data.refundsDate){
            data.refundsDate = data.refundsDate.format("YYYY-MM-DD");
        }
        if(data.orderTime){
            data.orderTime = data.orderTime.format("YYYY-MM-DD");
        }
        
        data.id = this.props.match.params.id;        
        this.setState({
            loading:true
        });

        var base = this;
        HttpUtils.post("/api/order/update",data).then(function(response){            
            base.setState({
                loading:false
            });
            if(response){
                Message.success("订单信息修改成功");                
            }
        });
    }

    /**
     * 选择订单状态事件
     */
    onSelectOrderStatus=(e)=>{
        this.setState({
            isNeedTraceUser:e !== "pending"
        })
    }

    /**
     * 选择网点
     */
    onSelectBranch=(e)=>{
        this.setState({
            currentEnginner:{},
            enginnerData:[],
        });
        console.log("e",e);
        this.state.branchData.map((item,index)=>{   
                     
            if(item.id===e){                
                this.getEnginnerList(e);
                let orderInfo = {...this.state.orderInfo};
                orderInfo.bankAccountName = item.bankAccountName;
                orderInfo.bankAccountCode = item.bankAccountCode;
                orderInfo.bankName = item.bankName;
                this.setState({
                    currentBranch:item,
                    orderInfo:orderInfo
                });             
            }
        });
    }

    /**
     * 选择工程师
     */
    onSelectEnginner=(e)=>{        
        console.log(e);
        this.state.enginnerData.map((item,index)=>{
            console.log("id:"+item.ie+",e:"+e);
            if(item.id===e){
                this.setState({
                    currentEnginner:item
                });
                console.log("item",item);
            }
        });
    }

    /**
     * 调整厂商金额
     */
    onChangeTotalPrice=(e,tag)=>{        
        let values = this.props.form.getFieldsValue(["routeQuantity","routePrice","otherPrice"]);        
        values[tag]=e;
        this.props.form.setFieldsValue({
            totalPrice:Math.floor(values.routeQuantity) * Math.floor(values.routePrice),
            actualPrice:Math.floor(values.routeQuantity) * Math.floor(values.routePrice) + Math.floor(values.otherPrice)
        });
    }

    /**
     * 调整结算金额
     */
    onChangePaymentPrice=(e,tag)=>{       
        if(this.state.isAdmin){
            let values = this.props.form.getFieldsValue(["routeQuantity","routeServicePrice","branchBalancePrice","branchOtherPrice"]);        
            values[tag] = e;
            this.props.form.setFieldsValue({
                branchBalancePrice:Math.floor(values.routeQuantity)*Math.floor(values.routeServicePrice),
                actualPaymentPrice:Math.floor(values.routeQuantity)*Math.floor(values.routeServicePrice) + Math.floor(values.branchOtherPrice),
            });
        }
    }

    /**
     * 多选框选中事件
     */
    onChangeCheckbox=(e)=>{
        const key = e.target.id
        const status = !this.state[key];
        this.setState({[key]:status});
    }

    /**
     * 获取网点工程师数据
     */
    getEnginnerList=(branchId)=>{
        const base = this;
        ChSearch.enginnerList(branchId,(enginnerList)=>{
            base.setState({
                enginnerData:enginnerList
            })
        })
    }

    /**
     * 添加订单状态事件
     */
    onAddEvent=()=>{
        this.setState({
            statusFrameShow:true,
        })
    }
    /**
     * 提交订单状态表单
     */
    onHandleCreate=()=>{
        const statusForm = this.statusForm.props.form;
        this.setState({
            loadingStatus:true,
        })
        statusForm.validateFields((err, values) => {
            if (err) {
                return;
            }
            let data = {
                orderId:this.state.orderInfo.id,
                eventTime:values.eventTime.format("YYYY-MM-DD"),
                description:values.description                
            }
            const base = this;
            statusForm.resetFields();
            HttpUtils.post("/api/order/event/create",data).then(function(response){
                if(response){
                    let orderEvents = base.state.orderEvents;
                    orderEvents.unshift(response.orderEvent);
                    base.setState({ statusFrameShow: false,loadingStatus:false, orderEvents:orderEvents});
                }
            });
            
        });

    }
    onHandleCancel=()=>{
        this.setState({ statusFrameShow: false });
    }

    /**
     * 删除订单状态（事件）
     */
    onRemoveEvent=(eventId)=>{
        const base = this;
        Confirm({
            title: '删除此状态',
            content: '确定要删除这条状态信息吗？',
            onOk() {
                var params = {id:eventId};
                HttpUtils.delete("/api/order/event/delete",{params:params}).then(function(response){                    
                    if(response){
                        var items = base.state.orderEvents;                        
                        for(var i=0;i<items.length;i++){                            
                            if(items[i].id===eventId){
                                items.splice(i,1);
                            }
                        }
                        base.setState({
                            orderEvents:items,
                        })
                    }
                });
            },
            onCancel() {},
        });
    }
    
    getOrderStatusForm=(statusForm)=>{
        this.statusForm = statusForm;
    }

    /**
     * 删除证单
     */
    onRemoveOrder=(orderId)=>{
        const base = this;
        Confirm({
            title: '删除订单',
            content: '确定要删除这张订单吗？',
            onOk() {
                var params = {id:orderId};
                HttpUtils.delete("/api/order/delete",{params:params}).then(function(response){                    
                    if(response){                        
                        base.context.menuRoute('dash.order');
                        base.props.history.push("/dash/order");
                    }
                });
            },
            onCancel() {},
        });
    }

    /**
     * 取消订单
     */
    onCancelOrder=(orderId)=>{
        const base = this;
        Confirm({
            title: '取消订单',
            content: '确定要取消这张订单吗？',
            onOk() {
                const orderStatus = 'cancel';
                var data = {id:orderId,orderStatus:orderStatus};
                HttpUtils.post("/api/order/updateStatus",data).then(function(response){                    
                    if(response){
                        base.context.menuRoute('dash.order');
                        base.props.history.push("/dash/order");
                    }
                });
            },
            onCancel() {},
        });
    }


    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }

    render = ()=> {        
        const order = this.state.orderInfo;
        const {getFieldDecorator} = this.props.form;


        // 设置订单类型下拉框数据
        let orderTypes = [];
        OrderType.map((item,index)=>{
            orderTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

        // 设置订单状态下拉框数据
        let orderStatus = [];
        OrderStatus.map((item,index)=>{
            orderStatus.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

        // 设置跟进人下拉框数据
        let trackDatas = [];
        this.state.trackData.map((item,index)=>{
            trackDatas.push(<Option key={index} value={item.id}>{item.uid}({item.realName})</Option>);
        });

        // 设置订单网点数据
        let branchDatas = [];
        this.state.branchData.map((item,index)=>{
            branchDatas.push(<Option key={index} value={item.id}>{item.name}</Option>);
        });

        // 设置网点负责人信息
        let branchUser = {};
        if(this.state.currentBranch){
            if(this.state.currentBranch.user){
                branchUser = this.state.currentBranch.user;
            }            
        }

        // 设置工程师数据
        let enginnerDatas = [];        
        this.state.enginnerData.map((item,index)=>{
            enginnerDatas.push(<Option key={index} value={item.id}>{item.uid}({item.realName})</Option>);                       
        });
        let enginner = {};
        if(this.state.currentEnginner){
            enginner = this.state.currentEnginner;
        }

        // 设置请款状态
        let orderPaymentStatus = [];
        PaymentStatus.map((item,index)=>{
            orderPaymentStatus.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

        // 设置付款方式
        let orderPaymentMethods = [];
        PaymentMethod.map((item,index)=>{
            orderPaymentMethods.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

        // 读取当前登录用户信息
        const user = window.config.user; 
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关上传文件',
        }

        // 编辑表单内容
        let editContent = undefined;        
        if(order){
            // 订单详情
            let TabPaneMore = undefined;     
            // 订单帐号信息
            let TabPanePayment = undefined;
            // 订单实时状态
            let TabPaneEvent = undefined;
            // 订单项目文件
            let TabPaneProjectFile = undefined;
            // 验收文件
            let TabPaneCheckFile = undefined;

            let deleteBtn = undefined;
            if(order.orderStatus==='pending'){
                deleteBtn = <Button icon="undo" title="撤销订单" onClick={this.onCancelOrder.bind(this,order.id)}></Button>;
            }
            if(this.state.isAdmin && !this.state.isFollow){
                deleteBtn = <Button icon="delete" title="删除订单" onClick={this.onRemoveOrder.bind(this,order.id)}></Button>
            }
            
            // Tabs 扩展Button  
            const extOperations = (
                <ButtonGroup>
                    <Button icon="left" title="返回" onClick={this.onBack}></Button>                
                    {deleteBtn}
                    <Button loading={this.state.loading} title="保存" icon="save" htmlType="submit">保存订单</Button>
                </ButtonGroup>
            );

            if(this.state.isAdmin){
                TabPaneMore = <TabPane tab="详细信息" key="more-info">
                    <Row>
                        <Col span={12}>                            
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="项目跟进人">
                                        {getFieldDecorator('trackUserId',
                                        {rules:[{required:this.state.isNeedTraceUser,message:'请选择项目跟进人',}],initialValue:order.trackUserId
                                        })(<Select disabled={this.state.isFollow} placeholder="请选择项目跟进人">
                                            {trackDatas}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点">
                                        {getFieldDecorator('branchId',
                                        {rules:[{required:false,message:'请选择网点',}],initialValue:order.branchId
                                        })(<Select onSelect={this.onSelectBranch} placeholder="请选择网点">
                                            {branchDatas}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>    
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点负责人">
                                        {getFieldDecorator('branchUserRealName',
                                        {rules:[{required:false}],initialValue:branchUser.realName
                                        })(<Input disabled />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="上门工程师">
                                        {getFieldDecorator('enginnerUserId',
                                        {rules:[{required:false,}],initialValue:enginner.realName
                                        })(<Select onSelect={this.onSelectEnginner}>
                                            {enginnerDatas}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row> 
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="联系电话">
                                        {getFieldDecorator('branchEngineerPhone',
                                        {rules:[{required:false}],initialValue:enginner.phone
                                        })(<Input disabled />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="邮箱">
                                        {getFieldDecorator('branchEngineerEmail',
                                        {rules:[{required:false}],initialValue:enginner.email
                                        })(<Input disabled />)} 
                                    </FormItem>                    
                                </Col>
                            </Row> 
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="每路价格">
                                        {getFieldDecorator('routePrice',
                                        {rules:[{required:true,message:'请填写每路价格(默认为0)'}],initialValue:order.routePrice
                                        })(<InputNumber onChange={(e)=>{this.onChangeTotalPrice(e,'routePrice')}} min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>                          
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="总价格">
                                        {getFieldDecorator('totalPrice',
                                        {rules:[{required:true,message:'请填写总价格(默认为0)'}],initialValue:order.totalPrice
                                        })(<InputNumber min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="厂商其它费用">
                                        {getFieldDecorator('otherPrice',
                                        {rules:[{required:true,message:'请填写厂商其它费用(默认为0)'}],initialValue:order.otherPrice
                                        })(<InputNumber onChange={(e)=>{this.onChangeTotalPrice(e,'otherPrice')}} min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="厂商其它费用说明">
                                        {getFieldDecorator('otherPriceDescription',
                                        {rules:[{required:false}],initialValue:order.otherPriceDescription
                                        })(<Input />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="实际总额">
                                        {getFieldDecorator('actualPrice',
                                        {rules:[{required:true,message:'请填写实际总额(默认为0)'}],initialValue:order.actualPrice
                                        })(<InputNumber min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Divider dashed />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="每路服务费用">
                                        {getFieldDecorator('routeServicePrice',
                                        {rules:[{required:true,message:'请填写每路服务费用(默认为0)'}],initialValue:order.routeServicePrice
                                        })(<InputNumber onChange={(e)=>{this.onChangePaymentPrice(e,'routeServicePrice')}} min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="与网点结算价格">
                                        {getFieldDecorator('branchBalancePrice',
                                        {rules:[{required:true,message:'请填写与网点结算价格(默认为0)'}],initialValue:order.branchBalancePrice
                                        })(<InputNumber onChange={(e)=>{this.onChangePaymentPrice(e,'branchBalancePrice')}} min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点其它费用">
                                        {getFieldDecorator('branchOtherPrice',
                                        {rules:[{required:true,message:'请填写网点其它费用(默认为0)'}],initialValue:order.branchOtherPrice
                                        })(<InputNumber onChange={(e)=>{this.onChangePaymentPrice(e,'branchOtherPrice')}} min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点其它费用说明">
                                        {getFieldDecorator('branchOtherPriceDescription',
                                        {rules:[{required:false}],initialValue:order.branchOtherPriceDescription
                                        })(<Input />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="实际付款金额">
                                        {getFieldDecorator('actualPaymentPrice',
                                        {rules:[{required:true,message:'请填写实际付款金额(默认为0)'}],initialValue:order.actualPaymentPrice
                                        })(<InputNumber min={0} precision={2} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                        </Col>
                    </Row>                    
                </TabPane>;

                TabPanePayment = <TabPane tab="帐务信息" key="payment-info">
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点收款户名">
                                        {getFieldDecorator('bankAccountName',
                                        {rules:[{required:false}],initialValue:order.bankAccountName
                                        })(<Input />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="网点收款银行帐号">
                                        {getFieldDecorator('bankAccountCode',
                                        {rules:[{required:false}],initialValue:order.bankAccountCode
                                        })(<Input />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="收款行支行名称">
                                        {getFieldDecorator('bankName',
                                        {rules:[{required:false}],initialValue:order.bankName
                                        })(<Input />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="请款状态">
                                        {getFieldDecorator('paymentStatus',
                                        {rules:[{required:false}],initialValue:order.paymentStatus
                                        })(<Select placeholder="请选择请款状态">
                                            {orderPaymentStatus}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="财务付款日期">
                                        {getFieldDecorator('paymentTime',
                                        {rules:[{required:false}],initialValue:order.paymentTime?Moment(order.paymentTime,"YYYY-MM-DD"):null
                                        })(<DatePicker placeholder="选择财务付款日期" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="备注">
                                        {getFieldDecorator('memo',
                                        {rules:[{required:false}],initialValue:order.memo
                                        })(<TextArea type="textarea" rows={10} />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="付款方式">
                                        {getFieldDecorator('paymentMethod',
                                        {rules:[{required:false}],initialValue:order.paymentMethod
                                        })(<Select placeholder="请选择付款方式">
                                            {orderPaymentMethods}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="是否已对帐">
                                        {getFieldDecorator('isChecked',
                                        {rules:[{required:false}],initialValue:this.state.isChecked
                                        })(<Checkbox checked={this.state.isChecked} onChange={this.onChangeCheckbox} placeholder="是否已对帐" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="对帐时间">
                                        {getFieldDecorator('checkedDate',
                                        {rules:[{required:false}],initialValue:order.checkedDate?Moment(order.checkedDate,"YYYY-MM-DD"):null
                                        })(<DatePicker placeholder="选择对帐时间" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="是否已开票">
                                        {getFieldDecorator('isInvoice',
                                        {rules:[{required:false}],initialValue:this.state.isInvoice
                                        })(<Checkbox checked={this.state.isInvoice} onChange={this.onChangeCheckbox} placeholder="是否已开票" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="开票时间">
                                        {getFieldDecorator('invoiceDate',
                                        {rules:[{required:false}],initialValue:order.invoiceDate?Moment(order.invoiceDate,"YYYY-MM-DD"):null
                                        })(<DatePicker placeholder="选择开票时间" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="是否已回款">
                                        {getFieldDecorator('isRefunds',
                                        {rules:[{required:false}],initialValue:this.state.isRefunds
                                        })(<Checkbox checked={this.state.isRefunds} onChange={this.onChangeCheckbox} placeholder="是否已回款" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="回款时间">
                                        {getFieldDecorator('refundsDate',
                                        {rules:[{required:false}],initialValue:order.refundsDate?Moment(order.refundsDate,"YYYY-MM-DD"):null
                                        })(<DatePicker placeholder="选择回款时间" />)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>;                
            }

            TabPaneProjectFile =  <TabPane tab="项目资料" key="project-file-info">
                <div className="grid-box">
                    <Upload {...this.getUploadConfig('PROJECT')}>
                        <Button icon="cloud-upload">上传文件</Button>   
                    </Upload>
                    <Table style={{marginTop:"10px"}} locale={locale} footer={this.getTableFooter.bind(this,"project-file-info")} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageProjectInfo} onChange={this.handleProjectChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.projectFileSource} bordered />
                </div>
                </TabPane>;
            TabPaneCheckFile = <TabPane tab="验收资料" key="check-file-info">
                <div className="grid-box">
                    <Upload {...this.getUploadConfig('CHECK')}>
                        <Button icon="cloud-upload">上传文件</Button>   
                    </Upload>
                    <Table style={{marginTop:"10px"}} locale={locale} footer={this.getTableFooter.bind(this,"check-file-info")} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageCheckInfo} onChange={this.handleCheckChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.checkFileSource} bordered />
                </div>
                </TabPane>;
            /**
             * 订单事件处理
             */
            let OrderEvents = [];            
            let addEventBtn = undefined;
            let deleteEventBtnEnabled = {
                disabled:"disabled"
            };
            if(this.state.isAdmin || user.role==='engineer'){
                addEventBtn = <Button onClick={this.onAddEvent.bind(this)} style={{marginBottom:"10px"}} icon="plus">添加状态</Button>
                deleteEventBtnEnabled:{}
            }
            if(this.state.orderEvents.length>0){
                this.state.orderEvents.map((item,index)=>{
                    OrderEvents.push(
                        <tr key={index}>
                            <td>{item.orderSn}</td>
                            <td>{item.realName}({item.uid})</td>
                            <td>{item.description}</td>
                            <td>{Moment(item.eventTime).format("YYYY-MM-DD")}</td>
                            <td><a className="item-a delete" {...deleteEventBtnEnabled} onClick={this.onRemoveEvent.bind(this,item.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a></td>
                        </tr>
                    )
                });
            }else{
                OrderEvents.push(
                    <tr key="0">
                        <td colSpan="5" style={{padding:"20px",textAlign:"center"}}>没有相关动态</td>
                    </tr>
                )

            }

            TabPaneEvent = <TabPane tab="实时状态" key="event-info">
                <div className="view-box">   
                    {addEventBtn}              
                    <OrderStatusFragment wrappedComponentRef={this.getOrderStatusForm.bind(this)} loadingStatus={this.state.loadingStatus} visible={this.state.statusFrameShow} onCancel={this.onHandleCancel} onCreate={this.onHandleCreate} />
                    <table className="view-table">
                        <thead>
                            <tr>
                                <td style={{width:"200px"}}>订单编号</td>
                                <td style={{width:"200px"}}>帐号</td>
                                <td>状态描述</td>
                                <td style={{width:"200px"}}>时间</td>
                                <td style={{width:"80px"}}>操作</td>
                            </tr> 
                        </thead>
                        <tbody>
                            {OrderEvents}
                        </tbody>
                    </table>
                </div>
            </TabPane>

            editContent = (<div className="grid-form">            
            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>
                <Tabs tabBarExtraContent={extOperations} onChange={this.onTabChangeHandler.bind(this)} type="card">
                    <TabPane tab="基本信息" key="basic-info">                                                
                        <Row>
                            <Col span={12}>                               
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单来源">
                                            {getFieldDecorator('userCreate',
                                            {rules:[{required:false}]
                                            })(<Input disabled type="text" placeholder={WebUtils.getSelectCustomerName(order.orderUser)} />)} 
                                        </FormItem>                    
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单类型">
                                            {getFieldDecorator('orderType',
                                            {rules:[{required:true,message:'请选择订单类型',}],initialValue:order.orderType
                                            })(<Select placeholder="请选择订单类型">
                                                {orderTypes}
                                            </Select>)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单工期">
                                            {getFieldDecorator('orderTime',
                                            {rules:[{required:false}],initialValue:order.orderTime?Moment(order.orderTime,"YYYY-MM-DD"):undefined
                                            })(<DatePicker placeholder="选择订单工期" />)} 
                                        </FormItem>                    
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="工期说明">
                                            {getFieldDecorator('timeDescription',
                                            {rules:[{required:false}],initialValue:order.timeDescription
                                            })(<Input type="text" placeholder="请输入工期说明" />)} 
                                        </FormItem>                    
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="派单日期">
                                            {getFieldDecorator('assignDate',
                                            {rules:[{required:true,message:'请选择派单日期'}],initialValue:Moment(order.assignDate,"YYYY-MM-DD")
                                            })(<DatePicker placeholder="选择派单日期" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="客户名称">
                                            {getFieldDecorator('consumerName',
                                            {rules:[{required:true,message:'客户名称不能为空'}],initialValue:order.consumerName
                                            })(<Input type="text" placeholder="请填客户名称" />)} 
                                        </FormItem>                     
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="客户联系人">
                                            {getFieldDecorator('consumerContact',
                                            {rules:[{required:true,message:'客户联系人不能为空'}],initialValue:order.consumerContact
                                            })(<Input type="text" placeholder="请填客户联系人" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="联系电话">
                                            {getFieldDecorator('consumerPhone',
                                            {rules:[{required:true,message:'联系电话不能为空'}],initialValue:order.consumerPhone
                                            })(<Input type="text" placeholder="请填写联系电话" />)} 
                                        </FormItem>                     
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="省/市/区">
                                            {getFieldDecorator('areas',
                                            {rules:[{required:true,message:'请选择地区'}],initialValue:[order.province,order.city,order.area]
                                            })(<Cascader onChange={this.onAreaChange.bind(this)} changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
                                        </FormItem>                     
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="安装地址">
                                            {getFieldDecorator('address',
                                            {rules:[{required:true,message:'安装地址不能为空'}],initialValue:order.address
                                            })(<Input type="text" placeholder="请填写安装地址" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="安装点位">
                                            {getFieldDecorator('routeQuantity',
                                            {rules:[{required:true,message:'安装点位0-500'}],initialValue:order.routeQuantity
                                            })(<InputNumber onChange={(e)=>{this.onChangeTotalPrice(e,'routeQuantity')}} min={0} max={500} precision={0} />)} 
                                        </FormItem>
                                    </Col>
                                </Row> 
                            </Col>
                            <Col span={12}>   
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单编号">
                                            {getFieldDecorator('sn',
                                            {rules:[{required:false}],initialValue:order.sn
                                            })(<Input disabled />)} 
                                        </FormItem>
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单状态">
                                            {getFieldDecorator('orderStatus',
                                            {rules:[{required:true,message:'请选择订单状态',}],initialValue:order.orderStatus
                                            })(<Select disabled={!this.state.isAdmin} onSelect={this.onSelectOrderStatus}>
                                                {orderStatus}
                                            </Select>)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>                   
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="服务内容">
                                            {getFieldDecorator('serviceContent',
                                            {rules:[{required:false}],initialValue:order.serviceContent
                                            })(<TextArea type="textarea" rows={10} placeholder="请填服务内容" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单要求">
                                            {getFieldDecorator('requirement',
                                            {rules:[{required:false}],initialValue:order.requirement
                                            })(<TextArea type="textarea" rows={10} placeholder="请填订单要求" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </TabPane>
                    {TabPaneMore}
                    {TabPanePayment}
                    {TabPaneEvent}
                    {TabPaneProjectFile}
                    {TabPaneCheckFile}
                </Tabs>                
            </Form>
            </div>);
        }
        return (        
        <Spin spinning={this.state.loading}>
            <Breadcrumb style={{marginTop:"10px"}}>
                <Breadcrumb.Item>控制台</Breadcrumb.Item>
                <Breadcrumb.Item>我的订单</Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/dash/order">订单列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>修改订单</Breadcrumb.Item>
            </Breadcrumb>
            <iframe src={this.state.downloadUrl} /> 
            {editContent}
        </Spin>
        );
    }  
}

const EditOrder = Form.create()(EditOrderForm);
export default EditOrder;