import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form, Table,Select,Input,Row,Col,Button,Modal,Icon
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import './log.css';
import NoteType from '../../common/NoteType';

const Option = Select.Option;
const InputGroup = Input.Group;
const Search = Input.Search;
const Confirm = Modal.confirm;

/**
 * 公告列表
 */
class NoteListForm extends React.Component {
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
            loading:false
        };
    } 
    static contextTypes = {
        menuRoute:PropTypes.func
    }
    getNoteContent(text){
        return <label title={text}>{text.substring(0,30)+'...'}</label>;
    } 
    /**
     * 返回列表中的操作按钮
     */
    getOperationMenus=(record)=>{
        const user = window.config.user;
        const editBtn = <Link to={'/dash/note/edit/'+record.id} className="item-a" title="修改"><Icon type="edit" theme="outlined" /></Link>;
        let deleteBtn = <a className="item-a delete" onClick={this.onDeleteNote.bind(this,record.id)} href="javascript:;" title="删除"><Icon type="delete" theme="outlined" /></a>;        
        return (<Row>{editBtn}{deleteBtn}</Row>);
    }   
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'公告标题',sorter: true,dataIndex:'title'},
            {title:'公告类型',width:200,sorter: true,dataIndex:'type',render:(text)=>(WebUtils.getEnumTag(NoteType,text))},
            {title:'公告内容',sorter: false,dataIndex:'content',render:(text)=>(this.getNoteContent(text))},           
            {title:'帐号',sorter: true,dataIndex:'uid'},
            {title:'创建时间',width:160,sorter: true,dataIndex:'createDate'},
            {title:'操作',width:90,render:(id,record)=>(this.getOperationMenus(record))},
        ];
    } 
    componentDidMount = ()=>{
        this.searchNote(this.state.pageInfo);
    }  
    /**
     * 查询公告
     */
    searchNote=(params={})=>{
        const base = this;       
        base.setState({
            loading:true,
        });

        HttpUtils.get("/api/note/list",{params:params}).then(function(response){
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
     * 添加公告
     */
    onAddNote=()=>{
        this.context.menuRoute('dash.note.list');
        this.props.history.push("/dash/note/create");
    }
    /**
     * 删除公告
     */
    onDeleteNote(noteId){
        const base = this;
        Confirm({
            title:"删除公告",            
            content:"确定要删除这条公告信息吗？",
            onOk:()=>{
                const data = {id:noteId};
                console.log("data:"+data);
                HttpUtils.post('/api/note/delete',data).then(function(response){
                    const dataSource = base.state.dataSource;
                    for(var i=0;i<dataSource.length;i++){
                        if(dataSource[i].id===noteId){
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
        this.searchNote(pager);

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
                base.searchNote(pagination);
            }
        });

    }
    getTableFooter=()=>{
        const base = this;
        return (<label>共找到<span style={{color:"#1890ff"}}> {base.state.pageInfo.total} </span>条公告信息</label>);
    } 
    render = ()=>{
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关日志信息',
        }
        const {getFieldDecorator} = this.props.form; 
        const beforeSearchKeys = getFieldDecorator("searchProperty",{initialValue:"title"})(
            <Select style={{minWidth:"120px"}}>
               <Option value="title">标题</Option>
               <Option value="content">内容</Option>
           </Select>);
        return (<div className="log-box">
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
                        <Button onClick={this.onAddNote} icon="plus">添加公告</Button>
                    </Col>
                </Row>                
            </Form>
            <Table locale={locale} footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
        </div>)
    }  
}

const NodeList = Form.create()(NoteListForm);
export default NodeList;