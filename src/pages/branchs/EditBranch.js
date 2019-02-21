import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
     Form, Input,Tabs, Button,Spin,
     Icon, Row, Message, Table,Modal,
     Cascader, Col,
     Select,Breadcrumb
} from 'antd';
import AreaData from '../../common/AreaData';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
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
 * 修改网点
 */
class EditBranchForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            branchUserData:[],
            branchInfo:{},
            branchUserList:[]
        };
    }
    static contextTypes = {
        menuRoute:PropTypes.func
    }
   
    /**
     * 删除网点信息
     */
    onDeleteBranch=()=>{
        const base = this;
        Confirm({
            title:"删除网点",
            content:"确定要删除该网点？",
            okText:"确定",
            cancelText:"取消",
            onOk:()=>{
                const data = {id:base.props.match.params.id}
                HttpUtils.post('/api/branch/delete',data).then(function(response){
                    if(response){
                        base.context.menuRoute('dash.branch.list');
                        base.props.history.push("/dash/branch/list");
                    }
                })

            },
            onCancel:()=>{

            }
            
        })
    }
    
    /**
     * 删除网点成员(工程师)
     */
    removeMember=(record,id)=>{
        const base = this;
        Confirm({
            title:"移除网点工程师",
            content:"是否要移除网点此网点工程师？",
            okText:"移除",
            cancelText:"取消",
            onOk:()=>{
                const data = {id:id};
                HttpUtils.post('/api/branch/removeMember',data).then(function(response){
                    let branchUserList = base.state.branchUserList;
                    for(var i=0;i<branchUserList.length;i++){
                        if(branchUserList[i].id===id){
                            branchUserList.splice(i,1);
                        }
                    }
                    base.setState({
                        branchUserList:branchUserList
                    });
                });
            },
            onCancel:()=>{

            }         
        })
    }
    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{   
        let deleteBtn = <a className="item-a delete" onClick={this.removeMember.bind(this,record,record.id)} href="javascript:;" title="移除"><Icon type="delete" theme="outlined" /></a>;
        /**
        if(this.state.branchInfo.userId===record.id){
            deleteBtn = <label style={{margin:"0px 4px"}}><Icon style={{color:"#eaeaea"}} type="delete" theme="outlined" /></label>;
        }*/
        return deleteBtn;
    }
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'账号',dataIndex:'uid'},
            {title:'真实姓名',dataIndex:'realName'},
            {title:'联系电话',dataIndex:'phone'},
            {title:'邮箱',dataIndex:'email'},
            {title:'创建时间', width:180,dataIndex:'createDate'},
            {title:'操作',width:60,render:(id,record)=>(this.getOperationMenus(record))},
        ];
    }
    componentDidMount = ()=>{
        this.getBranchInfo();
    }
    getBranchInfo=()=>{
        const base = this;
        base.setState({
            loading:true
        });
        const params = {id:base.props.match.params.id};
        HttpUtils.get("/api/branch/info",{params:params}).then(function(response){
            base.setState({
                loading:false,
                branchInfo:response.branch,
            });
            base.getMoreData();
            
        });
    }
    
    getMoreData = ()=>{
        const base = this;
        // 获取网点负责人数据
        let requests = [HttpUtils.get("/api/user/list",{params:{role:"branchs"}})];
        // 获取网点成员（工程师）数据
        const params = {branchId:base.props.match.params.id};              
        requests.push(HttpUtils.get("/api/user/listByBranch",{params:params}));
        axios.all(requests).then(axios.spread(function(buData,buList){                    
            base.setState({
                branchUserData:buData.list,
                branchUserList:buList.list
            }); 
        }));
    }
    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.submitBranch(values);
            }            
        });
    }
    /**
     * 提交网点表单
     */
    submitBranch(data){
        const base = this;
        base.setState({
            loading:true,
        });

        if(data.areas.length>0){
            data.province = data.areas[0];
        }
        if(data.areas.length>1){
            data.city = data.areas[1];
        }
        if(data.areas.length>2){
            data.area = data.areas[2];
        }
        data.id = this.state.branchInfo.id;

        HttpUtils.post('/api/branch/update',data).then(function(response){
            if(response){    
                Message.success("网点信息更新成功");                                              
            }
            base.setState({
                loading:false
            }); 
        });

    }
    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }
    render=()=>{
        const {getFieldDecorator} = this.props.form;
        const branch = this.state.branchInfo;
        let users = [<Option key={-1} value="">没有负责人</Option>];
        this.state.branchUserData.map((item,index)=>{
            users.push(<Option key={index} value={item.id}>{item.uid}({item.realName})</Option>);
        });

        // Tabs 扩展Button  
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" title="返回" onClick={this.onBack}></Button>
                <Button icon="delete" title="删除网点" onClick={this.onDeleteBranch}></Button>
            </ButtonGroup>
        );

        return (
            <Spin  spinning={this.state.loading}>
                <Breadcrumb style={{marginTop:"10px"}}>
                    <Breadcrumb.Item>控制台</Breadcrumb.Item>
                    <Breadcrumb.Item>网点管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/dash/branch/list">网点列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>修改网点信息</Breadcrumb.Item>
                </Breadcrumb>
                <div className="branch-form">
                    <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}> 
                        <Tabs tabBarExtraContent={extOperations} type="card">
                            <TabPane tab="网点信息" key="basic-info">                                                   
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="网点名称">
                                                    {getFieldDecorator('name',
                                                    {rules:[{required:true,message:'请输入网点名称',}],initialValue:branch.name
                                                    })(<Input type="text" placeholder="请输入网点名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系电话">
                                                    {getFieldDecorator('phone',
                                                    {rules:[{required:true,message:'请输入联系电话',}],initialValue:branch.phone
                                                    })(<Input type="text" placeholder="请输入公司名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="电子邮箱">
                                                    {getFieldDecorator('email',
                                                    {rules:[{required:true,message:'请输入电子邮箱',}],initialValue:branch.email
                                                    })(<Input type="text" placeholder="请输入电子邮箱" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="省/市/区">
                                                    {getFieldDecorator('areas',
                                                    {rules:[{required:true,message:'请选择地区'}],initialValue:[branch.province,branch.city,branch.area]
                                                    })(<Cascader changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
                                                </FormItem>                     
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系地址">
                                                    {getFieldDecorator('address',
                                                    {rules:[{required:false}],initialValue:branch.address
                                                    })(<Input type="text" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                        
                                        <Row>                                        
                                            <Col span={24}>
                                                <FormItem {...btnItemLayout}>
                                                    <Button loading={this.state.loading} type="primary" htmlType="submit">保存</Button>
                                                </FormItem>
                                            </Col>                                    
                                        </Row>
                                    </Col>
                                </Row>                                
                            </TabPane>
                            <TabPane tab="收款账户" key="payment-info">                                                    
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="收款户名">
                                                    {getFieldDecorator('bankAccountName',
                                                    {rules:[{required:false}],initialValue:branch.bankAccountName
                                                    })(<Input type="text" placeholder="请输入收款户名" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="收款银行账号">
                                                    {getFieldDecorator('bankAccountCode',
                                                    {rules:[{required:false}],initialValue:branch.bankAccountCode
                                                    })(<Input type="text" placeholder="请输入收款银行账号" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="收款支行名称">
                                                    {getFieldDecorator('bankName',
                                                    {rules:[{required:false}],initialValue:branch.bankName
                                                    })(<Input type="text" placeholder="请输入收款支行名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>                                        
                                            <Col span={24}>
                                                <FormItem {...btnItemLayout}>
                                                    <Button loading={this.state.loading} type="primary" htmlType="submit">保存</Button>
                                                </FormItem>
                                            </Col>                                    
                                        </Row>
                                    </Col>
                                </Row>                            
                            </TabPane>
                            
                            <TabPane disabled tab="网点成员" key="user-list">
                                <div className="branch-box">
                                    <Table loading={this.state.loading} pagination={false} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.branchUserList} bordered />
                                </div>
                            </TabPane>
                            
                        </Tabs>
                    </Form>
                </div>
            </Spin>
        )
    }
}
const EditBranch = Form.create()(EditBranchForm);
export default EditBranch;