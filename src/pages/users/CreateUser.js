import React from 'react';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,
     Row, Message, Radio, Col,Modal,
     Select
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import ChSearch from '../../components/ChSearch';
import Role from '../../common/Role';
import Sex from '../../common/Sex';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

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
 * 创建用户
 */
class CreateUserFrom extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
            branchData:[],
        } 
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
                this.submitUser(values);
            }            
        });
    }
    /**
     * 提交表单
     */
    submitUser=(params={})=>{
        const base = this;
        if(params.password1!==params.password2){
            Message.error("两次密码不一致");
            return;
        }
        base.setState({
            loading:true,
        })
        
        params.pwd = params.password1;
        HttpUtils.post('/api/user/create',params).then(function(response){
            base.setState({
                loading:false,
            })
            if(response){                
                Modal.success({
                    title: '提交成功',
                    content: '用户已添加成功',
                    okText: '好的',
                    onOk(){                        
                        base.context.menuRoute('dash.user.list');
                        base.props.history.push("/dash/user/list");
                    }
                }); 

            }
        })
    }

    componentDidMount = ()=>{
        this.getBranchsData({});
    }

    /**
     * 获取网点列表
     */
    getBranchsData=(keywords)=>{
        const base = this;
        const params={keywords:keywords};
        ChSearch.branchList(params,function(list){
            base.setState({
                branchData:list,
            })
        });
    }

    onSearchBranch=(keywords)=>{
        this.getBranchsData(keywords);
    }

    render=()=>{
        const {getFieldDecorator} = this.props.form;       
        let branchs = [<Option key={-1} value="">不属于任何网点</Option>]
        this.state.branchData.map((item,index)=>{
            branchs.push(<Option key={index} value={item.id}>{item.name}</Option>);
        });
       
        return (
            <Spin  spinning={this.state.loading}>
                <div className="grid-form">
                    <Tabs type="card">
                        <TabPane tab="添加用户" key="basic-info">
                            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="登录帐号">
                                                    {getFieldDecorator('uid',
                                                    {rules:[{required:true,pattern:/^(((1[0-9]))+\d{9})$/,message:'请输入手机号作用登录帐号',}]
                                                    })(<Input type="text" placeholder="请输入登录帐号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="登录密码">
                                                    {getFieldDecorator('password1',
                                                    {rules:[{required:true,pattern:/^[a-zA-Z0-9_-]{6,18}$/,message:'密码为6-18位数字或字母组合',}]
                                                    })(<Input type="password" placeholder="请输入登录密码" />)} 
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
                                                <FormItem {...formItemLayout}
                                                    label="真实姓名">
                                                    {getFieldDecorator('realName',
                                                    {rules:[{required:true,pattern:/^[\u4E00-\u9FA5A-Za-z]+$/,message:'请输入真实姓名',}]
                                                    })(<Input type="text" placeholder="请输入登录帐号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                                                             
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="性别">
                                                    {getFieldDecorator('sex',
                                                    {rules:[{required:false}]
                                                    })(<RadioGroup options={Sex} />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="公司名称">
                                                    {getFieldDecorator('company',
                                                    {rules:[{required:false}]
                                                    })(<Input  />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系电话">
                                                    {getFieldDecorator('phone',
                                                    {rules:[{required:true,message:'请输入联系电话'}]
                                                    })(<Input placeholder="请输入联系电话" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="邮箱">
                                                    {getFieldDecorator('email',
                                                    {rules:[{required:true,pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,message:'请输入正确的邮箱'}]
                                                    })(<Input placeholder="请输入邮箱" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="角色">
                                                    {getFieldDecorator('role',
                                                    {rules:[{required:false}],initialValue:'customer'
                                                    })(<RadioGroup options={Role} />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>                                        
                                            <Col span={24}>
                                                <FormItem {...btnItemLayout}>
                                                    <Button loading={this.state.loading} type="primary" htmlType="submit">提交</Button>
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
        )
    }

}
const CreateUser = Form.create()(CreateUserFrom);
export default CreateUser;