import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
    Form, Input,Tabs, Button,Spin,
    Breadcrumb, Row, Message, Modal,
    Radio, Col,Select
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import ChSearch from '../../components/ChSearch';
import Role from '../../common/Role';
import Sex from '../../common/Sex';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const Confirm = Modal.confirm;

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
 * 修改用户资料
 */
class EditUserFrom extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading:false,
            userInfo:{},
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
        params.id = this.getUserId();
        base.setState({
            loading:true,
        })
        HttpUtils.post('/api/user/update',params).then(function(response){
            if(response){
                Message.success("用户资料修改成功");
            }
            base.setState({
                loading:false
            });
        })
    }

    componentDidMount = ()=>{
        this.getUserInfo();
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

    /**
     * 获取用户资料
     */
    getUserInfo = ()=>{
        const base = this;
        base.setState({
            loading:true,
        })
        const params = {id:this.getUserId()};
        HttpUtils.get('/api/user/info',{params:params}).then(function(response){
            if(response){
                base.setState({
                    userInfo:response.user,
                    loading:false,
                });                
            }
            base.getBranchsData();
        });
    }

    /**
     * 删除用户资料
     */
    onDeleteUser=()=>{
        const base = this;
        Confirm({
            title:"删除用户",
            content:"确定要删除这个用户吗？",
            onOk:()=>{
                const data = {id:this.getUserId()}
                HttpUtils.post('/api/user/delete',data).then(function(response){
                    base.context.menuRoute('dash.user.list');
                    base.props.history.push("/dash/user/list");
                });
            },
            onCancel:()=>{

            }
        });
    }

    /**
     * 获取网点列表
     */
    getBranchsData=()=>{
        const base = this;
        ChSearch.branchList(function(list){
            base.setState({
                branchData:list,
            })
        });
    }

    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }
    /**
     * 修改密码
     */
    onEditPassword=()=>{
        const userId = this.getUserId();
        this.context.menuRoute('dash.user.password.edit');
        this.props.history.push("/dash/user/password/edit/"+userId);
    }

    render=()=>{
        const {getFieldDecorator} = this.props.form;       
        const user = this.state.userInfo;
        const branchs = [];
        this.state.branchData.map((item,index)=>{
            branchs.push(<Option key={index} value={item.id}>{item.name}</Option>);
        });

        // Tabs 扩展Button  
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" title="返回" onClick={this.onBack}></Button>
                <Button icon="delete" title="删除用户" onClick={this.onDeleteUser}></Button>
                <Button title="修改密码" onClick={this.onEditPassword}>修改密码</Button>
            </ButtonGroup>
        );

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
       
        return (
            <Spin spinning={this.state.loading}>
                <Breadcrumb style={{marginTop:"10px"}}>
                    <Breadcrumb.Item>控制台</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/dash/user/list">用户列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>修改用户信息</Breadcrumb.Item>
                </Breadcrumb>
                <div className="user-form">
                    <Tabs tabBarExtraContent={extOperations} type="card">
                        <TabPane tab="修改用户资料" key="basic-info">
                            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="登录帐号">
                                                    {getFieldDecorator('uid',
                                                    {rules:[{required:true,pattern:/^(((1[0-9]))+\d{9})$/,message:'请输入手机号作用登录帐号',}],initialValue:user.uid
                                                    })(<Input type="text" disabled placeholder="请输入登录帐号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row> 
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="真实姓名">
                                                    {getFieldDecorator('realName',
                                                    {rules:[{required:true,pattern:/^[\u4E00-\u9FA5A-Za-z]+$/,message:'请输入真实姓名',}],initialValue:user.realName
                                                    })(<Input type="text" placeholder="请输入登录帐号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                                                             
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="性别">
                                                    {getFieldDecorator('sex',
                                                    {rules:[{required:false}],initialValue:user.sex
                                                    })(<RadioGroup options={Sex} />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="公司名称">
                                                    {getFieldDecorator('company',
                                                    {rules:[{required:false}],initialValue:user.company
                                                    })(<Input  />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系电话">
                                                    {getFieldDecorator('phone',
                                                    {rules:[{required:true,message:'请输入联系电话'}],initialValue:user.phone
                                                    })(<Input placeholder="请输入联系电话" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="邮箱">
                                                    {getFieldDecorator('email',
                                                    {rules:[{required:true,pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,message:'请输入正确的邮箱'}],initialValue:user.email
                                                    })(<Input placeholder="请输入邮箱" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="所属网点">
                                                    {getFieldDecorator('branchId',
                                                    {rules:[{required:false}],initialValue:user.branchId
                                                    })(<Select>
                                                        {branchs}
                                                    </Select>)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="角色">
                                                    {getFieldDecorator('role',
                                                    {rules:[{required:false}],initialValue:user.role
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
const EditUserinfo = Form.create()(EditUserFrom);
export default EditUserinfo;