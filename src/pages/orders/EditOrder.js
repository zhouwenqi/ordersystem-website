import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,Modal,
     TimePicker,Select,InputNumber,Breadcrumb
} from 'antd';
import moment from 'moment';
import areaData from '../../common/AreaData';
import orderType from '../../common/OrderType';
import chSearch from '../../components/ChSearch';
import httpUtil from '../../utils/HttpUtils';
import BasePage from '../BasePage';
import './order.css';
import WebUtils from '../../utils/WebUtils';

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
const btnItemLayout = {    
    wrapperCol: {
      xs: { span: 24,offset:0 },
      sm: { span: 14,offset:4 },
    },
};

/**
 * 编辑订单
 */
class EditOrderForm extends BasePage {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
            customerData:[],
            customerValue:undefined,
            isEdit:false,
            orderInfo:undefined,
            orderUserId:undefined,
        }
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
        httpUtil.get("/api/order/info",{params:params}).then(function(response){
            if(response){  
                let isOrderEdit = response.order.orderStatus === '待派单';                
                base.setState({                    
                    orderInfo:response.order, 
                    loading:false,
                    orderUserId:response.order.orderUserId,
                    isEdit:isOrderEdit,          
                });
            }else{
                base.setState({
                    loading:false
                });
            }
            
        });
    }
    /**
     * 获取订单类型value
     */
    getOrderTypeValue=(orderTypeLabel)=>{
        let orderTypeValue = undefined;
        orderType.map((item,index)=>{
            if(item.label===orderTypeLabel){
                orderTypeValue = item.value;
            }
        });
        return orderTypeValue;
    }
    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }

    render = ()=> {
        let order = this.state.orderInfo;
        const {getFieldDecorator} = this.props.form;

        // 设置订单类型下拉框数据
        let orderTypes = [];
        orderType.map((item,index)=>{
            orderTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });

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
            </ButtonGroup>
        )

        // 编辑表单内容
        let editContent = undefined;        
        if(order){
            editContent = (<div className="grid-form">
            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>
                <Tabs tabBarExtraContent={extOperations}>
                    <TabPane tab="订单基本信息" key="basic-info">                                                
                        <Row>
                            <Col span={12}>
                                {CustomerSelect}
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单类型">
                                            {getFieldDecorator('orderType',
                                            {rules:[{required:true,message:'请选择订单类型',}],initialValue:this.getOrderTypeValue(order.orderType)
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
                                            {rules:[{required:true,message:'请选择派单日期'}],initialValue:moment(order.assignDate,"YYYY-MM-DD")
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
                                            })(<Cascader changeOnSelect={true} options={areaData} placeholder="请选择" />)} 
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
                                        <FormItem {...btnItemLayout}>
                                            <Button loading={this.state.loading} type="primary" htmlType="submit">保存订单</Button>
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
                                            {rules:[{required:true,message:'请选择受理日期'}],initialValue:moment(order.acceptDate,"YYYY-MM-DD")
                                            })(<DatePicker disabled placeholder="选择受理日期" />)} 
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

                    <TabPane tab="详细信息" key="more-info">
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="项目跟进人">
                                            {getFieldDecorator('trackUserId',
                                            {rules:[{required:true,message:'请选择项目跟进人',}],initialValue:this.getOrderTypeValue(order.orderType)
                                            })(<Select placeholder="请选择项目跟进人">
                                                {orderTypes}
                                            </Select>)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>                            
                            </Col>
                        </Row>                    
                    </TabPane>
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