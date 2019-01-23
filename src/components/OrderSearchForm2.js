import React from 'react';
import {
    Row,Select,
    Col,
    Modal,
    Form
} from 'antd';

import OrderStatus from '../common/OrderStatus';

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
    style:{
        marginBottom:"10px"
    }
};

/**
 * 订单高级查询（客户）
 */
class OrderSearchForm extends React.Component {
    constructor(props,context) {
        super(props,context);   
        this.state={
            searchData:{},
            trackData:[],
            branchData:[],
        }     
    } 

    componentDidMount = ()=>{
        
    }

    render=()=>{
        const {visible,onCancel,onSearch,form} = this.props;
        const { getFieldDecorator } = form; 
        // 设置订单状态下拉框数据
        let orderStatus = [];
        OrderStatus.map((item,index)=>{
            orderStatus.push(<Option key={index} value={item.index}>{item.label}</Option>);
        });       

        return (
            <React.Fragment>                
                <Modal onCancel={onCancel} onOk={onSearch} visible={visible} title="订单高级查询">                    
                    <Form size="small">                        
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="订单状态">
                                {getFieldDecorator('orderStatuss',
                                {rules:[{required:false,}]
                                })(<Select mode="multiple">{orderStatus}</Select>)}
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