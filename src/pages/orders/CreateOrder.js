import React from 'react';
import { 
    Form, Input,Tabs, Button,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,
     TimePicker,Select,InputNumber
} from 'antd';
import moment from 'moment';
import areaData from '../../common/AreaData';
import orderType from '../../common/OrderType';
import httpUtil from '../../utils/HttpUtils';
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
        // 设置客户来源
        data.orderUserId = window.config.user.id;
        // 设置授理时间
        data.acceptDate = '2018/11/20';
       

        httpUtil.post("/api/order/create",data).then(function(response){
            if(response === undefined || response==null){
                return;
            } 
            console.log(response);
        });
        console.log(data);
    }
    
    render = ()=> {
        const {getFieldDecorator} = this.props.form;
        const orderTypes = [];
        orderType.map((item,index)=>{            
            orderTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);
        });
        return (
        <div className="grid-form">
            <Tabs>
                <TabPane tab="订单基本信息" key="basic-info">
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
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...btnItemLayout}>
                                            <Button type="primary" htmlType="submit">提交订单</Button>
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
                                            {rules:[{required:true,message:'请选择受理日期'}],initialValue:moment(new Date(),"YYYY-MM-DD")
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