import React from 'react';
import { 
    Form, Input,Tabs, Button,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,
     TimePicker,Select,InputNumber
} from 'antd';
import areaData from '../../utils/AreaData';
import './order.css';

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
class CreateOrderForm extends React.Component {
    /**
     * 提交表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.login(values);
            }
        });
    }
    
    render = ()=> {
        const {getFieldDecorator} = this.props.form;
        return (
        <div className="grid-form">
            <Tabs>
                <TabPane tab="订单基本信息">
                    <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单来源">
                                            {getFieldDecorator('userCreate',
                                            {rules:[{required:false}]
                                            })(<Input disabled type="text" placeholder="成都盯盯" />)} 
                                        </FormItem>                    
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单类型">
                                            {getFieldDecorator('orderType',
                                            {rules:[{required:true,message:'请选择订单类型'}]
                                            })(<Select placeholder="请选择订单类型">
                                                <Option value="4444">44444</Option>
                                                <Option value="5555">555555</Option>
                                                <Option value="6666">66666666</Option>
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
                                            })(<Input type="text" placeholder="" />)} 
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
                                            })(<Input type="text" placeholder="" />)} 
                                        </FormItem>                     
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="客户联系人">
                                            {getFieldDecorator('consumerContact',
                                            {rules:[{required:true,message:'客户联系人不能为空'}]
                                            })(<Input type="text" placeholder="" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="联系电话">
                                            {getFieldDecorator('consumerPhone',
                                            {rules:[{required:true,message:'联系电话不能为空'}]
                                            })(<Input type="text" placeholder="" />)} 
                                        </FormItem>                     
                                    </Col>                            
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="省/市/区">
                                            {getFieldDecorator('areas',
                                            {rules:[{required:true,message:'请选择市'}]
                                            })(<Cascader changeOnSelect={true} options={areaData} placeholder="请选择" />)} 
                                        </FormItem>                     
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="安装地址">
                                            {getFieldDecorator('address',
                                            {rules:[{required:true,message:'安装地址不能为空'}]
                                            })(<Input type="text" placeholder="" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row>  
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="服务内容">
                                            {getFieldDecorator('serviceContent',
                                            {rules:[{required:false}]
                                            })(<TextArea type="textarea" rows={10} placeholder="" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout}
                                            label="订单要求">
                                            {getFieldDecorator('requirement',
                                            {rules:[{required:false}]
                                            })(<TextArea type="textarea" rows={10} placeholder="" />)} 
                                        </FormItem>                    
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...btnItemLayout}>
                                            <Button  type="primary" htmlType="submit">提交订单</Button>
                                        </FormItem>
                                    </Col>                                    
                                </Row>
                            </Col>
                        </Row>
                                     
                    </Form>
                </TabPane>
            </Tabs>
        </div>
        );
    }
}
const CreateOrder = Form.create()(CreateOrderForm);
export default CreateOrder;