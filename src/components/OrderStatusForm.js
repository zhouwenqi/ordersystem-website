import React from 'react';
import {
    Message,Spin,
    Row,
    Col,
    Icon,
    Dropdown,
    Input,
    DatePicker,
    Modal,
    Button,
    Form
} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;
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

class OrderStatusForm extends React.Component {
    constructor(props,context) {
        super(props,context);        
    } 
    
    render=()=>{
        const {visible,onCancel,onCreate,form,loadingStatus} = this.props;
        const { getFieldDecorator } = form;       
        return (
            <React.Fragment>                
                <Modal loading={loadingStatus} onCancel={onCancel} onOk={onCreate} visible={visible} title="添加订单状态">                    
                    <Form size="small">
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="状态时间">
                                {getFieldDecorator('eventTime',
                                {rules:[{required:true,message:'请选择状态事件时间',}]
                                })(<DatePicker placeholder="请选择状态事件时间" />)}
                                </FormItem>
                            </Col>
                        </Row>   
                        <Row>
                            <Col span={24}>
                                <FormItem {...formItemLayout}  style={{marginBottom:"0px"}}
                                    label="状态描述">
                                    {getFieldDecorator('description',
                                    {rules:[{required:true,message:'请填状态描述'}]
                                    })(<TextArea type="textarea" rows={10} placeholder="请填状态描述" />)} 
                                </FormItem>                    
                            </Col>
                        </Row>                     
                    </Form>
                    
                </Modal>
            </React.Fragment>
              
        );
    }
}
const OrderStatusFragment = Form.create()(OrderStatusForm);
export default OrderStatusFragment;