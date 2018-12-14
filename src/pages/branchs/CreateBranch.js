import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,
     Icon, Row, Message, Checkbox,
     Cascader, DatePicker,Col,Modal,
     Select,InputNumber,Breadcrumb
} from 'antd';
import AreaData from '../../common/AreaData';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import ChSearch from '../../components/ChSearch';

const FormItem = Form.Item;
const Option = Select.Option;
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
 * 添加网点
 */
class CreateBranchForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            branchUserData:[],
        };
    }
    static contextTypes = {
        menuRoute:PropTypes.func
    }

    componentDidMount = ()=>{
        this.getBranchUserList();
    }

    /**
     * 获取网点负责人
     */
    getBranchUserList = () => {
        const base = this;
        ChSearch.branchsUserList(function(list){
            base.setState({
                branchUserData:list
            })
        });
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

        HttpUtils.post('/api/branch/create',data).then(function(response){
            if(response){                
                Modal.success({
                    title: '提交成功',
                    content: '网点已添加成功',
                    okText: '好的',
                    onOk(){                        
                        base.context.menuRoute('dash.branch.list');
                        base.props.history.push("/dash/branch/list");
                    }
                });                
            }
        });

    }
    render=()=>{
        const {getFieldDecorator} = this.props.form;
        let users = [];
        this.state.branchUserData.map((item,index)=>{
            users.push(<Option key={index} value={item.id}>{item.uid}({item.realName})</Option>);
        });
        return (
            <Spin  spinning={this.state.loading}>
                <div className="grid-form">
                    <Tabs type="card">
                        <TabPane tab="添加网点" key="basic-info">
                            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="网点名称">
                                                    {getFieldDecorator('name',
                                                    {rules:[{required:true,message:'请输入网点名称',}]
                                                    })(<Input type="text" placeholder="请输入网点名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="公司名称">
                                                    {getFieldDecorator('company',
                                                    {rules:[{required:true,message:'请输入公司名称',}]
                                                    })(<Input type="text" placeholder="请输入公司名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系电话">
                                                    {getFieldDecorator('phone',
                                                    {rules:[{required:true,message:'请输入联系电话',}]
                                                    })(<Input type="text" placeholder="请输入公司名称" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="省/市/区">
                                                    {getFieldDecorator('areas',
                                                    {rules:[{required:true,message:'请选择地区'}]
                                                    })(<Cascader changeOnSelect={true} options={AreaData} placeholder="请选择" />)} 
                                                </FormItem>                     
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="联系地址">
                                                    {getFieldDecorator('address',
                                                    {rules:[{required:false}]
                                                    })(<Input type="text" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="网点负责人">
                                                    {getFieldDecorator('userId',
                                                    {rules:[{required:false}]
                                                    })(<Select placeholder="请选择网点负责人">
                                                        {users}
                                                    </Select>)} 
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
const CreateBranch = Form.create()(CreateBranchForm);
export default CreateBranch;