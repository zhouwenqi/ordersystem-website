import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Form,Icon, Row, Table,Modal,
    Input,Select,Col,
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';

import './branch.css';

const Confirm = Modal.confirm;
const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;

/**
 * 网点列表
 */
class BranchListForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            user:null,
            loading:false,
            pageInfo:{
                pageSize:20,
                current:1,
                total:0,
                sortField:"create_date",
                sortDirection:"desc"
            },       
            dataSource:[]
        };
    } 
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'网点名称',sorter: false,dataIndex:'name'},
            {title:'公司名称',sorter: false,dataIndex:'company'},
            {title:'联系电话',width:200,sorter: false,dataIndex:'phone'},
            {title:'省',sorter: false,dataIndex:'province'},
            {title:'市',sorter: false,dataIndex:'city'},
            {title:'区',width:200,sorter: false,dataIndex:'area'},
            {title:'负责人',width:200,sorter: false,dataIndex:'userId',render:(id,record)=>(record.user?record.user.uid:undefined)},
            {title:'创建时间',width:160,sorter: false,dataIndex:'createDate'},
            {title:'操作',width:80,dataIndex:'',render:(id,record)=>(this.getOperationMenus(record))}
        ];
    }
    componentDidMount = ()=>{
        this.searchBranch();
    }
    /**
     * 删除网点信息
     */
    onDeleteBranch=(branch)=>{
        const base = this;
        Confirm({
            title:"删除网点",
            content:"确定要删除该网点？",
            okText:"确定",
            cancelText:"取消",
            onOk:()=>{
                const data = {id:branch.id}
                HttpUtils.post('/api/branch/delete',data).then(function(response){
                    let dataSource = base.state.dataSource;
                    if(response){
                        for(var i=0;i<dataSource.length;i++){
                            if(dataSource[i].id===branch.id){
                                dataSource.splice(i,1);
                            }
                        }                        
                    }
                    console.log(dataSource);
                    base.setState({
                        dataSource:dataSource
                    });
                })

            },
            onCancel:()=>{

            }
            
        })
    }
    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        let editBtn = <Link className="item-a" to={'/dash/branch/edit/'+record.id} title="编编网点信息"><Icon type="edit" theme="outlined" /></Link>;
        let deleteBtn = <a className="item-a delete" onClick={this.onDeleteBranch.bind(this,record)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>        
        return (<Row>{editBtn}{deleteBtn}</Row>);
    }

    /**
     * 查询网点
     */
    searchBranch=(params={})=>{
        const base = this;       
        base.setState({
            loading:true,
        });

        HttpUtils.get("/api/branch/search",{params:params}).then(function(response){
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
        this.searchBranch(pager);

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
                base.searchBranch(pagination);
            }
        });

    }
    render=()=>{
        const {getFieldDecorator} = this.props.form; 
        const beforeSearchKeys = getFieldDecorator("searchProperty",{initialValue:"name"})(
            <Select style={{minWidth:"120px"}}>
               <Option value="name">网点名称</Option>
               <Option value="company">公司名称</Option>
               <Option value="phone">联系电话</Option>
           </Select>);
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关网点信息',
        }
        return (<div className="branch-box">
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
                </Row>                
            </Form>
            <Table locale={locale} loading={this.state.loading} pagination={false} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
        </div>)
    }
}
const BranchList = Form.create()(BranchListForm);
export default BranchList;