import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Input,Tabs, Button,Spin,Breadcrumb,
    Row, Message, Col,Modal
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {TextArea} = Input;
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
 * 编辑公告
 */
class EditNoteFrom extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            noteInfo:{},
        };
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
                if(values.title.length<=3){
                    Message.warn("公告标题必须大于3个字符");
                    return;
                }
                if(values.content.length<=5){
                    Message.warn("公告内容必须大于5个字符");
                    return;
                }
                this.submitUser(values);
            }            
        });
    }
    componentDidMount = ()=>{
        this.getNoteInfo();
    }
    /**
     * 获取当前公告信息
     */
    getNoteInfo=()=>{
        const id = this.props.match.params.id;
        this.setState({
            loading:true,
        });
        const params = {"id":id}
        const base = this;
        HttpUtils.get('/api/note/info',{"params":params}).then(function(response){
            base.setState({
                loading:false,
            })
            if(response){
                base.setState({
                    noteInfo:response.note,
                })
            }
        });

    }
    /**
     * 提交表单
     */
    submitUser=(params={})=>{
        const base = this;
        base.setState({
            loading:true,
        });
        params.id = this.props.match.params.id;
        HttpUtils.post('/api/note/update',params).then(function(response){
            base.setState({
                loading:false
            });
            if(response){
                Message.success("公告信息修改成功");
            }
            
        })
    }
    /**
     * 后退
     */
    onBack=()=>{
        window.history.back();
    }

    /**
     * 删除公告
     */
    onDeleteNote(){
        const base = this;
        const data = {id:base.state.noteInfo.id};
        Confirm({
            title:"删除公告",            
            content:"确定要删除这条公告信息吗？",
            onOk:()=>{                
                console.log("data:"+data);
                HttpUtils.post('/api/note/delete',data).then(function(response){
                    base.context.menuRoute('dash.note.list');
                    base.props.history.push("/dash/note/list");
                });
            },
            onCancel:()=>{

            }
        });
    }
    
    render=()=>{
        const {getFieldDecorator} = this.props.form;
        const note = this.state.noteInfo;
        // Tabs 扩展Button  
        const extOperations = (
            <ButtonGroup>
                <Button icon="left" title="返回" onClick={this.onBack}></Button>
                <Button icon="delete" title="删除公告" onClick={this.onDeleteNote.bind(this)}></Button>
            </ButtonGroup>
        );
        return (<div>
            <Spin spinning={this.state.loading}>   
                <Breadcrumb style={{marginTop:"10px"}}>
                    <Breadcrumb.Item>控制台</Breadcrumb.Item>
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/dash/note/list">系统公告</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>修改公告</Breadcrumb.Item>
                </Breadcrumb>             
                <div className="user-form">
                    <Tabs type="card" tabBarExtraContent={extOperations}>
                        <TabPane tab="修改公告信息" key="basic-info">
                            <Form onSubmit={this.handleSubmit} size="small" style={{padding:'10px 0px'}}>                        
                                <Row>
                                    <Col span={12}>                                                     
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="公告标题">
                                                    {getFieldDecorator('title',
                                                    {rules:[{required:true,message:'请输入公告标题',}],initialValue:note.title
                                                    })(<Input type="text" placeholder="请输入公告标题" />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <FormItem {...formItemLayout}
                                                    label="公告内容">
                                                    {getFieldDecorator('content',
                                                    {rules:[{required:true,message:'请输入公告内容',}],initialValue:note.content
                                                    })(<TextArea placeholder="请输入公告内容" type="textarea" rows={10} />)} 
                                                </FormItem>                    
                                            </Col>
                                        </Row>                                        
                                        <Row>                                        
                                            <Col span={24}>
                                                <FormItem {...btnItemLayout}>
                                                    <Button loading={this.state.loading} type="primary" htmlType="submit">发布</Button>
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

const EditNote = Form.create()(EditNoteFrom);
export default EditNote;