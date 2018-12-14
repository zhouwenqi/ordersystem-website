import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
    Form, Input,Tabs, Button,Spin,
    Breadcrumb, Row, Message, Modal,
    Radio, Col,Select
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

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
 * 修改用户密码
 */
class EditPasswordForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            user:{},
        };
    } 
    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.submitUser(values);
            }            
        });
    }
    componentDidMount = ()=>{
        this.getUserInfo();
    }
    getUserInfo=()=>{
        const base = this;
        base.setState({
            loading:true,
        })
        const params = {id:this.getUserId()};
        HttpUtils.get('/api/user/info',{params:params}).then(function(response){
            if(response){
                base.setState({
                    user:response.user,
                    loading:false,
                });
            }
        });
    }
    /**
     * 提交表单
     */
    submitUser=(params={})=>{
        const base = this;        
        params.id = this.getUserId();   
        if(params.password1!==params.password2){
            Message.error("两次密码不一致");
            return;
        }
        params.pwd = params.password1;     
        base.setState({
            loading:true,
        })
        HttpUtils.post('/api/user/updatePwd',params).then(function(response){
            if(response){
                Message.success("登录密码修改成功");
                base.props.form.resetFields();
            }
            base.setState({
                loading:false
            });
        })
    }
    /**
     * 获取用户id
     */
    getUserId=()=>{
        let userId = window.config.user.id;
        if(this.props.match.params.id){
            userId = this.props.match.params.id;
        }
        return userId;
    }

    render=()=>{
        const {getFieldDecorator} = this.props.form;
        const user = this.state.user;
        return (<div>
            <Spin spinning={this.state.loading}>                
                <div className="user-form">
                    <Tabs type="card">
                        <TabPane tab="修改登录密码" key="basic-info">
                            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="登录帐号">
                                                    {getFieldDecorator('uid',
                                                    {rules:[{required:true,pattern:/^(((1[0-9]))+\d{9})$/,message:'请输入手机号作用登录帐号',}],initialValue:user.uid
                                                    })(<Input disabled type="text" placeholder="请输入登录帐号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="新的密码">
                                                    {getFieldDecorator('password1',
                                                    {rules:[{required:true,pattern:/^[a-zA-Z0-9_-]{6,18}$/,message:'密码为6-18位数字或字母组合',}]
                                                    })(<Input type="password" placeholder="请输入新的登录密码" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="确认密码">
                                                    {getFieldDecorator('password2',
                                                    {rules:[{required:true,pattern:/^[a-zA-Z0-9_-]{6,18}$/,message:'密码为6-18位数字或字母组合',}]
                                                    })(<Input type="password" placeholder="请输入确认密码" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>                                        
                                            <Col span={24}>
                                                <FormItem {...btnItemLayout}>
                                                    <Button loading={this.state.loading} type="primary" htmlType="submit">修改</Button>
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
        </div>)
    }
}
const EditPassword = Form.create()(EditPasswordForm);
export default EditPassword;