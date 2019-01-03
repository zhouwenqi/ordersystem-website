import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import { 
    Form, Input, Button,
     Icon, Row, Col,Modal,
     Select,Table,
} from 'antd';
import './user.css';
import Role from '../../common/Role';
import Sex from '../../common/Sex';
import ChSearch from '../../components/ChSearch';

const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;
const Confirm = Modal.confirm;

/**
 * 用户列表
 */
class UserListForm extends React.Component{
    constructor(props,context) {       
        super(props,context);
        this.state={
            pageInfo:{
                pageSize:20,
                current:1,
                total:0,
                sortField:"create_date",
                sortDirection:"desc",                
            },       
            dataSource:[],
            branchData:[],
            loading:false
        };
    }
    static contextTypes = {
        menuRoute:PropTypes.func
    }
    /**
     * 删除用户
     */
    onDeleteUser=(userId)=>{
        const base = this;
        Confirm({
            title:"删除用户",            
            content:"确定要删除这个用户吗？",
            onOk:()=>{
                const data = {id:userId};
                console.log("data:"+data);
                HttpUtils.post('/api/user/delete',data).then(function(response){
                    const dataSource = base.state.dataSource;
                    for(var i=0;i<dataSource.length;i++){
                        if(dataSource[i].id===userId){
                            dataSource.splice(i,1);
                        }
                    }
                    base.setState({
                        dataSource:dataSource
                    })
                });
            },
            onCancel:()=>{

            }
        });
    }
    /**
     * 添加用户
     */
    onAddUser=()=>{
        this.context.menuRoute('dash.user.create');
        this.props.history.push("/dash/user/create");
    }
    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        const user = window.config.user;
        const editBtn = <Link to={'/dash/user/edit/'+record.id} className="item-a" title="修改"><Icon type="edit" theme="outlined" /></Link>;
        let deleteBtn = <a className="item-a delete" onClick={this.onDeleteUser.bind(this,record.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>;
        if(record.id==user.id){
            deleteBtn = <label style={{margin:"0px 4px"}}><Icon style={{color:"#eaeaea"}} type="delete" theme="outlined" /></label>;
        }
        return (<Row>{editBtn}{deleteBtn}</Row>);
    }
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'用户名',sorter: true,dataIndex:'uid',render:(id,record)=>(<Link to={'/dash/user/edit/'+record.id}>{record.uid}</Link>)},
            {title:'真实姓名',sorter: true,dataIndex:'realName'},
            {title:'姓别',sorter: true,dataIndex:'sex',render:(id,record)=>(WebUtils.getEnumTag(Sex,record.sex))},
            {title:'公司名称',sorter: true,dataIndex:'company'},
            {title:'联系电话',sorter: true,dataIndex:'phone'},
            {title:'邮箱',sorter: true,dataIndex:'email',render:(text)=>(<a href={"mailto:"+text}>{text}</a>)},           
            {title:'联系地址',sorter: true,dataIndex:'address'},
            {title:'所属网点',sorter: true,dataIndex:'branchId',render:(text)=>(this.getBranchName(text))},
            {title:'角色',sorter: true,dataIndex:'role',render:(id,record)=>(WebUtils.getEnumTag(Role,record.role))},
            {title:'状态',dataIndex:'isEnabled',render:(id,record)=>(record.isEnabled?'启用':'禁用')},
            {title:'创建时间',sorter: true,dataIndex:'createDate',defaultSortOrder: 'descend'},            
            {title:'操作',width:90,render:(id,record)=>(this.getOperationMenus(record))},
        ];
    }
    componentDidMount = ()=>{
        this.getBranchList();
    }
    getTableFooter=()=>{
        const base = this;
        return (<label>共找到<span style={{color:"#1890ff"}}> {base.state.pageInfo.total} </span>条用户信息</label>);
    }
    /**
     * 获取网点名称
     */
    getBranchName(branchId){
        let branchName = undefined;
        this.state.branchData.map((item,index)=>{
            if(item.id===branchId){
                branchName = item.name;
            };
        });
        return branchName;
    }
    /**
     * 获取网点数据
     */
    getBranchList=()=>{
        const base = this;
        ChSearch.branchList({},function(list){
            base.setState({
                branchData:list,
            });
            base.searchUser(base.state.pageInfo);
        })
    }
    /**
     * 查询用户
     */
    searchUser=(params={})=>{
        const base = this;       
        base.setState({
            loading:true,
        });

        HttpUtils.get("/api/user/list",{params:params}).then(function(response){
            if(response){
                var pageInfo = response.pageInfo;
                var pagination = {...base.state.pageInfo};
                pagination.total = pageInfo.total;
                pagination.current = pageInfo.pageNumber;                
                base.setState({
                    dataSource:response.list,
                    loading:false,
                    pageInfo:pagination,
                })
            }
        });
    }
    /**
     * 切换页码
     */
    handleTableChange=(pagination,filters,sorter) => {        
        var pager = {...this.state.pageInfo};
        pager.current = pagination.current;
        pager.pageNumber = pagination.current;
        if(sorter.field){
            pager.sortDirection = sorter.order.replace("end","");
            pager.sortField = WebUtils.getHumpString(sorter.field);
        }else{
            pager.sortDirection = "desc";
            pager.sortField = "create_date"
        }
        
        this.setState({
            pageInfo:pager,            
        })
        this.searchUser(pager);

    }
    /**
     * 提交查询条件
     */
    handleSubmit=(e,event)=>{
        event.preventDefault();
        const base = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var pagination = {...base.state.pageInfo};
                pagination.searchProperty = values.searchProperty;
                pagination.searchValue = values.searchValue;
                pagination.pageNumber = 1;
                base.setState({
                    pageInfo:pagination
                });
                base.searchUser(pagination);
            }
        });

    }
    render=()=>{
        const {getFieldDecorator} = this.props.form; 
        const beforeSearchKeys = getFieldDecorator("searchProperty",{initialValue:"uid"})(
            <Select style={{minWidth:"120px"}}>
               <Option value="uid">帐号</Option>
               <Option value="real_name">真实姓名</Option>
               <Option value="phone">联系电话</Option>
               <Option value="email">邮箱</Option>
               <Option value="company">公司名称</Option>
               <Option value="address">联系地址</Option>
           </Select>);
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关订单信息',
        }
        return (
            <div className="user-box">
                <Form onSubmit={this.handleSubmit}>
                    <Row style={{margin:"0px 0px 10px 0px"}}>                  
                        <Col span={8}>                                                           
                            <InputGroup>
                            {getFieldDecorator('searchValue',
                                {rules:[{required:false}]
                                })(                          
                                    <Search onSearch={this.handleSubmit} addonBefore={beforeSearchKeys} enterButton placeholder="请输入查询关键词" />
                                )}
                            </InputGroup>                            
                        </Col>
                        <Col style={{textAlign:"right"}} offset={10} span={6}>                        
                            <Button onClick={this.onAddUser} icon="user-add">添加用户</Button>
                        </Col>
                    </Row>                
                </Form>
                <Table locale={locale} footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
            </div>            
        )
    }
}
const UserList = Form.create()(UserListForm);
export default UserList;