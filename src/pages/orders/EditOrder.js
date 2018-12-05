import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,Modal,Divider,
     TimePicker,Select,InputNumber,Breadcrumb
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

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const ButtonGroup = Button.Group;

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
        currentBranch:undefined,          
        customerValue:undefined,
        currentEnginner:undefined,
        isEdit:false,
        isNeedTraceUser:false,
        orderInfo:undefined,
        orderUserId:undefined,
    }
    static contextTypes = {
        menuRoute:PropTypes.func
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
        HttpUtils.get("/api/order/info",{params:params}).then(function(response){
            const user = window.config.user;
            if(response){  
                const orderInfo = response.order; 
                let isOrderEdit = orderInfo.orderStatus === 'pending';
                if(user.role==='manager' || user.role==='employee'){
                    isOrderEdit = true;
                }                            
                base.setState({                    
                    orderInfo:orderInfo,
                    loading:false,
                    orderUserId:orderInfo.orderUserId,
                    currentBranch:orderInfo.branch,
                    currentEnginner:orderInfo.enginnerUser,
                    isEdit:isOrderEdit,
                });   
                
                if(user.role==='manager' || user.role==='employee'){                
                    // 获取网点数据
                    let requests = [HttpUtils.get("/api/branch/list")];
                    // 获取项目跟进人数据
                    const trackParams = {role:"employee,manager"};               
                    requests.push(HttpUtils.get("/api/user/list",{params:trackParams}));
                    axios.all(requests).then(axios.spread(function(branchData,trackData){                    
                        base.setState({
                            trackData:trackData.list,
                            branchData:branchData.list
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
                Modal.success({
                    title: '提交成功',
                    content: '您的订单已修改成功',
                    okText: '好的',
                    onOk(){
                        // let {menuRoute} = this.context;
                        base.context.menuRoute('dash.order');
                        base.props.history.push("/dash/order");
                    }
                });                
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
            engineerData:[],
        });
        this.state.branchData.map((item,index)=>{            
            if(item.id===e){
                this.setState({currentBranch:item});
                this.getEnginnerList(e);
            }
        });
    }

    /**
     * 选择工程师
     */
    onSelectEnginner=(e)=>{
        this.state.engineerData.map((item,index)=>{
            if(item.id===e){
                this.setState({
                    currentEnginner:item
                })
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
        const user = window.config.user;
        if(user.role==='manager' || user.role==='employee'){
            let values = this.props.form.getFieldsValue(["routeServicePrice","branchBalancePrice","branchOtherPrice"]);        
            values[tag]=e;
            this.props.form.setFieldsValue({
                actualPaymentPrice:Math.floor(values.routeServicePrice) + Math.floor(values.branchBalancePrice) + Math.floor(values.branchOtherPrice),
            });
        }
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

        // 读取当前登录用户信息
        const user = window.config.user;        
        let CustomerSelect = <Row>
            <Col span={24}>
                <FormItem {...formItemLayout}
                    label="订单来源">
                    {getFieldDecorator('userCreate',
                    {rules:[{required:false}]
                    })(<Input disabled type="text" placeholder={WebUtils.getSelectCustomerName(user)} />)} 
                </FormItem>                    
            </Col>                            
        </Row>
        
        // Tabs 扩展Button  
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" onClick={this.onBack}></Button>
                <Button loading={this.state.loading} icon="save" htmlType="submit">保存订单</Button>
            </ButtonGroup>
        )

        // 编辑表单内容
        let editContent = undefined;        
        if(order){
            // 只有管理员或内部人员才能编辑订单详情
            let TabPaneMore = undefined;     
            let TabPanePayment = undefined;   
            if(user.role==='manager' || user.role==='employee'){
                TabPaneMore = <TabPane tab="详细信息" key="more-info">
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="订单状态">
                                        {getFieldDecorator('orderStatus',
                                        {rules:[{required:true,message:'请选择订单状态',}],initialValue:order.orderStatus
                                        })(<Select onSelect={this.onSelectOrderStatus}>
                                            {orderStatus}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayout}
                                        label="项目跟进人">
                                        {getFieldDecorator('trackUserId',
                                        {rules:[{required:this.state.isNeedTraceUser,message:'请选择项目跟进人',}],initialValue:order.trackUserId
                                        })(<Select placeholder="请选择项目跟进人">
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
                                        {rules:[{required:true,message:'请选择订单类型',}],initialValue:order.paymentStatus
                                        })(<Select placeholder="请选择订单类型">
                                            {orderTypes}
                                        </Select>)} 
                                    </FormItem>                    
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                </TabPane>
            }
            editContent = (<div className="grid-form">
            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>
                <Tabs tabBarExtraContent={extOperations} type="card">
                    <TabPane tab="基本信息" key="basic-info">                                                
                        <Row>
                            <Col span={12}>                               
                                {CustomerSelect}
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
                                            {rules:[{required:false}],initialValue:order.orderTime
                                            })(<Input type="text" placeholder="请输入订单工期" />)} 
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
                                            {rules:[{required:true,message:'请选择市'}],initialValue:[order.province,order.city,order.area]
                                            })(<Cascader changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
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
                                            label="安装路数">
                                            {getFieldDecorator('routeQuantity',
                                            {rules:[{required:true,message:'安装路数0-500'}],initialValue:order.routeQuantity
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
                </Tabs>                
            </Form>
            </div>);
        }
        return (        
        <Spin  spinning={this.state.loading}>
            <Breadcrumb style={{marginTop:"10px"}}>
                <Breadcrumb.Item>控制台</Breadcrumb.Item>
                <Breadcrumb.Item>我的订单</Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/dash/order">订单列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>修改订单</Breadcrumb.Item>
            </Breadcrumb>
            {editContent}
        </Spin>
        );
    }  
}

const EditOrder = Form.create()(EditOrderForm);
export default EditOrder;