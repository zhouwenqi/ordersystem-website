import React from 'react';
import { Form, Input, Button, Icon, Row, Message, Checkbox, DatePicker,Col,TimePicker,Select,Cascader,InputNumber } from 'antd';
import './order.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
class CreateOrderForm extends React.Component {
    
    render = ()=> {
        const {getFieldDecorator} = this.props.form;
        return (
        <div className="grid-form">
            <Form size="small" style={{width:'900px'}}>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="订单来源">
                            {getFieldDecorator('userCreate',
                            {rules:[{required:false}]
                            })(<Input disabled type="text" placeholder="成都盯盯" />)} 
                        </FormItem>                    
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="订单类型">
                            {getFieldDecorator('orderType',
                            {rules:[{required:true,message:'请选择订单类型'}]
                            })(<Select placeholder="订单类型">
                                <Option value="4444">44444</Option>
                                <Option value="5555">555555</Option>
                                <Option value="6666">66666666</Option>
                            </Select>)} 
                        </FormItem>                    
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="订单工期">
                            {getFieldDecorator('orderTime',
                            {rules:[{required:false}]
                            })(<Input type="text" placeholder="2018/3/3 下午" />)} 
                        </FormItem>                    
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="派单日期">
                            {getFieldDecorator('assignDate',
                            {rules:[{required:true,message:'请选择派单日期'}]
                            })(<DatePicker placeholder="派单日期" />)} 
                        </FormItem>                    
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="客户名称">
                            {getFieldDecorator('consumerName',
                            {rules:[{required:true,message:'客户名称不能为空'}]
                            })(<Input type="text" placeholder="万达影院" />)} 
                        </FormItem>                     
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="客户联系人">
                            {getFieldDecorator('consumerContact',
                            {rules:[{required:true,message:'客户联系人不能为空'}]
                            })(<Input type="text" placeholder="张xx" />)} 
                        </FormItem>                    
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="联系电话">
                            {getFieldDecorator('consumerPhone',
                            {rules:[{required:true,message:'客户名称不能为空'}]
                            })(<Input type="text" placeholder="18xxxxxxxxx" />)} 
                        </FormItem>                     
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="客户联系人">
                            {getFieldDecorator('drrwer',
                            {rules:[{required:true,message:'客户联系人不能为空'}]
                            })(<Input type="text" placeholder="万达广场" />)} 
                        </FormItem>                    
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <FormItem {...formItemLayout}
                            label="省">
                            {getFieldDecorator('province',
                            {rules:[{required:true,message:'请选择省'}]
                            })(<Select placeholder="请选择" />)} 
                        </FormItem>                     
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout}
                            label="市">
                            {getFieldDecorator('city',
                            {rules:[{required:true,message:'请选择市'}]
                            })(<Select placeholder="请选择" />)} 
                        </FormItem>                     
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout}
                            label="区">
                            {getFieldDecorator('area',
                            {rules:[{required:true,message:'请选择区'}]
                            })(<Select placeholder="请选择" />)} 
                        </FormItem>                     
                    </Col>
                </Row>
                
            </Form>
        </div>
        );
    }
}
const CreateOrder = Form.create()(CreateOrderForm);
export default CreateOrder;