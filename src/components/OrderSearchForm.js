import React from 'react';
import {
    Message,Checkbox,
    Row,Select,
    Col,Cascader,
    Icon,DatePicker,
    Dropdown,
    Input,
    Modal,
    Button,
    Form
} from 'antd';

import OrderStatus from '../common/OrderStatus';
import OrderType from '../common/OrderType';
import HttpUtils from '../utils/HttpUtils';
import Moment from 'moment';
import AreaData from '../common/AreaData';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
    style:{
        marginBottom:"10px"
    }
};

/**
 * 订单高级查询
 */
class OrderSearchForm extends React.Component {
    constructor(props,context) {
        super(props,context);   
        this.state={
            searchData:{},
            trackData:[],
        }     
    } 

    componentDidMount = ()=>{
        this.onGetTrackData();
    }

    // 获取项目跟进人数据
    onGetTrackData = ()=>{       
        const trackParams = {role:"follow"};   
        const base = this;           
        HttpUtils.get("/api/user/list",{params:trackParams}).then(function(response){
            console.log(response.list);
            base.setState({
                trackData:response.list,
            });
        });
    }
    
    render=()=>{
        const {visible,onCancel,onSearch,form,isFollow} = this.props;
        const { getFieldDecorator } = form; 
        // 设置订单状态下拉框数据
        let orderStatus = [];
        OrderStatus.map((item,index)=>{
            orderStatus.push(<Option key={index} value={item.index}>{item.label}</Option>);
        });
        // 设置订单类型下拉框数据
        let orderTypes = [];
        OrderType.map((item,index)=>{
            orderTypes.push(<Option key={index} value={item.index}>{item.label}</Option>);
        });
        // 设置项目跟进人下拉框数据
        let trackDatas = [<Option key={-1} value="">所有人</Option>];
        this.state.trackData.map((item,index)=>{
            trackDatas.push(<Option key={index} value={item.id}>{item.uid}({item.realName})</Option>);
        });

        let trackFormItem = undefined;
        if(!isFollow){
            trackFormItem = <Row>
                <Col span={24}>
                    <FormItem {...formItemLayout}
                        label="项目跟进人">
                        {getFieldDecorator('trackUserId',
                        {rules:[{required:false,}]
                        })(<Select placeholder="请选择项目跟进人">
                            {trackDatas}
                        </Select>)} 
                    </FormItem>
                </Col>
            </Row> 
        }

        return (
            <React.Fragment>                
                <Modal onCancel={onCancel} onOk={onSearch} visible={visible} title="订单高级查询">                    
                    <Form size="small">
                        {trackFormItem}
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="订单状态">
                                {getFieldDecorator('orderStatuss',
                                {rules:[{required:false,}]
                                })(<Select mode="multiple">{orderStatus}</Select>)}
                                </FormItem>
                            </Col>
                        </Row>   
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="订单类型">
                                    {getFieldDecorator('orderTypes',
                                    {rules:[{required:false}]
                                    })(<Select mode="multiple">{orderTypes}</Select>)} 
                                </FormItem>                    
                            </Col>
                        </Row>  
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="省/市/区">
                                    {getFieldDecorator('areas',
                                    {rules:[{required:false}]
                                    })(<Cascader changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
                                </FormItem>                     
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="是否已对帐">
                                    {getFieldDecorator('isChecked',
                                    {rules:[{required:false}]
                                    })(<Checkbox />)}
                                </FormItem>                     
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="是否已开票">
                                    {getFieldDecorator('isInvoice',
                                    {rules:[{required:false}]
                                    })(<Checkbox />)}
                                </FormItem>                     
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="是否已回款">
                                    {getFieldDecorator('isRefunds',
                                    {rules:[{required:false}]
                                    })(<Checkbox />)}
                                </FormItem>                     
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="创建时间">
                                    {getFieldDecorator('createDate',
                                    {rules:[{required:false}]
                                    })(<RangePicker />)}
                                </FormItem>                     
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}
                                    label="订单工期">
                                    {getFieldDecorator('orderTime',
                                    {rules:[{required:false}]
                                    })(<RangePicker />)}
                                </FormItem>                     
                            </Col>
                        </Row>                        
                    </Form>                    
                </Modal>
            </React.Fragment>              
        );
    }
}
const OrderSearchFragment = Form.create()(OrderSearchForm);
export default OrderSearchFragment;