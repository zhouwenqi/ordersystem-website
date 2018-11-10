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
            <Form size="small" style={{width:'60%',margin:'auto auto'}}>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="订单来源">
                            {getFieldDecorator('userCreate',
                            {rules:[{required:false}]
                            })(<Input type="text" placeholder="成都盯盯" />)} 
                        </FormItem>                    
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout}
                            label="订单类型">
                            {getFieldDecorator('orderType',
                            {rules:[{required:true,message:'请选择订单类型'}]
                            })(<Input type="text" placeholder="订单类型" />)} 
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
                            label="源单日期">
                            {getFieldDecorator('assignDate',
                            {rules:[{required:true,message:'请选择订单类型'}]
                            })(<Input type="text" placeholder="订单类型" />)} 
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
                            {getFieldDecorator('consumerContact',
                            {rules:[{required:true,message:'客户联系人不能为空'}]
                            })(<Input type="text" placeholder="万达广场" />)} 
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