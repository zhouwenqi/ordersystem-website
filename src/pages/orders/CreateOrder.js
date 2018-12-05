import React from 'react';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,Modal,
     TimePicker,Select,InputNumber
} from 'antd';
import Moment from 'moment';
import AreaData from '../../common/AreaData';
import OrderType from '../../common/OrderType';
import HttpUtils from '../../utils/HttpUtils';
import ChSearch from '../../components/ChSearch';
import BasePage from '../BasePage';
import './order.css';
import WebUtils from '../../utils/WebUtils';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {TextArea} = Input;

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
const btnItemLayout = {    
    wrapperCol: {
      xs: { span: 24,offset:0 },
      sm: { span: 14,offset:4 },
    },
};


/**
 * 创建订单
 */
class CreateOrderForm extends BasePage {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        loading:false,
        customerData:[],
        customerValue:undefined
    }
    static contextTypes = {
        menuRoute:PropTypes.func
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
        // 设置授理时间
        data.acceptDate = Moment().format("YYYY-MM-DD");

        
        this.setState({
            loading:true,
        });

        var base = this;
        HttpUtils.post("/api/order/create",data).then(function(response){            
            base.setState({
                loading:false
            });
            if(response){
                Modal.success({
                    title: '提交成功',
                    content: '您的订单已提交成功，请等待审核',
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

    componentDidMount =() =>{
        
    }
    
    /**
     * 查询客户列表
     */
    handlerSearchCustomer = (keywords)=>{
        let base = this;
        ChSearch.customerList(keywords,function(data){
            console.log("data:",data);
            base.setState({customerData:data})
        });
    }
    
    render = ()=> {
        const {getFieldDecorator} = this.props.form;
        const orderTypes = [];
        OrderType.map((item,index)=>{            
            orderTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

        let customerData = [];
        this.state.customerData.map((item,index)=>{            
            let customerName = WebUtils.getSelectCustomerName(item);
            customerData.push(<Option key={index} value={item.id}>{customerName}</Option>);
        });
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
        if(user.role==='manager' || user.role==='employee'){
            CustomerSelect = <Row>
                <Col span={24}>
                    <FormItem {...formItemLayout}
                        label="订单来源">
                        {getFieldDecorator('orderUserId',
                        {rules:[{required:true,message:'请选择订单来源'}]
                        })(<Select showSearch showArrow={false} filterOption={false} placeholder="请选择订单来源" onSearch={this.handlerSearchCustomer}>
                            {customerData}
                        </Select>)} 
                    </FormItem>                    
                </Col>                            
            </Row>
        }
        return (
        <Spin  spinning={this.state.loading}>
            <div className="grid-form">
                <Tabs type="card">
                    <TabPane tab="订单信息" key="basic-info">
                        <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                            <Row>
                                <Col span={12}>
                                    {CustomerSelect}                
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="订单类型">
                                                {getFieldDecorator('orderType',
                                                {rules:[{required:true,message:'请选择订单类型',}]
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
                                                {rules:[{required:false}]
                                                })(<Input type="text" placeholder="请输入订单工期" />)} 
                                            </FormItem>                    
                                        </Col>                            
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="派单日期">
                                                {getFieldDecorator('assignDate',
                                                {rules:[{required:true,message:'请选择派单日期'}]
                                                })(<DatePicker placeholder="选择派单日期" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="客户名称">
                                                {getFieldDecorator('consumerName',
                                                {rules:[{required:true,message:'客户名称不能为空'}]
                                                })(<Input type="text" placeholder="请填客户名称" />)} 
                                            </FormItem>                     
                                        </Col>                            
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="客户联系人">
                                                {getFieldDecorator('consumerContact',
                                                {rules:[{required:true,message:'客户联系人不能为空'}]
                                                })(<Input type="text" placeholder="请填客户联系人" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="联系电话">
                                                {getFieldDecorator('consumerPhone',
                                                {rules:[{required:true,message:'联系电话不能为空'}]
                                                })(<Input type="text" placeholder="请填写联系电话" />)} 
                                            </FormItem>                     
                                        </Col>                            
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="省/市/区">
                                                {getFieldDecorator('areas',
                                                {rules:[{required:true,message:'请选择市'}]
                                                })(<Cascader changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
                                            </FormItem>                     
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="安装地址">
                                                {getFieldDecorator('address',
                                                {rules:[{required:true,message:'安装地址不能为空'}]
                                                })(<Input type="text" placeholder="请填写安装地址" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row> 
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="安装路数">
                                                {getFieldDecorator('routeQuantity',
                                                {rules:[{required:true,message:'安装路数0-500'}],initialValue:0
                                                })(<InputNumber min={0} max={500} precision={0} />)} 
                                            </FormItem>
                                        </Col>
                                    </Row> 
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...btnItemLayout}>
                                                <Button loading={this.state.loading} type="primary" htmlType="submit">提交订单</Button>
                                            </FormItem>
                                        </Col>                                    
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="受理日期">
                                                {getFieldDecorator('acceptDate',
                                                {rules:[{required:true,message:'请选择受理日期'}],initialValue:Moment(new Date(),"YYYY-MM-DD")
                                                })(<DatePicker disabled placeholder="选择受理日期" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row>  
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="服务内容">
                                                {getFieldDecorator('serviceContent',
                                                {rules:[{required:false}]
                                                })(<TextArea type="textarea" rows={10} placeholder="请填服务内容" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row> 
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayout}
                                                label="订单要求">
                                                {getFieldDecorator('requirement',
                                                {rules:[{required:false}]
                                                })(<TextArea type="textarea" rows={10} placeholder="请填订单要求" />)} 
                                            </FormItem>                    
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                                        
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
        );
    }
}
const CreateOrder = Form.create()(CreateOrderForm);
export default CreateOrder;