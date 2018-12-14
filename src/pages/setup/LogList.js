import React from 'react';
import { 
    Form, Table,Row,Col,Select
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import './log.css';
import LogType from '../../common/LogType';

const FormItem = Form.Item;
const Option = Select.Option;

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

/**
 * 日志列表
 */
class LogListForm extends React.Component{
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
    getLogDescription(text){
        return <label title={text}>{text.substring(0,30)+'...'}</label>;
    }
    componentWillMount = () =>{
        // 表格列头
        this.dataColumns = [
            {title:'日志标题',sorter: true,dataIndex:'title'},
            {title:'日志类型',width:200,sorter: true,dataIndex:'logType',render:(text)=>(WebUtils.getEnumTag(LogType,text))},
            {title:'日志描述',sorter: false,dataIndex:'description',render:(text)=>(this.getLogDescription(text))},
            {title:'IP', width:200,sorter: true,dataIndex:'logIp'},
            {title:'帐号',sorter: true,dataIndex:'uid'},
            {title:'创建时间',width:160,sorter: true,dataIndex:'createDate'}
        ];
    }
    componentDidMount = ()=>{
        this.searchLog(this.state.pageInfo);
    }    
    /**
     * 查询用户
     */
    searchLog=(params={})=>{
        const base = this;       
        base.setState({
            loading:true,
        });

        HttpUtils.get("/api/log/list",{params:params}).then(function(response){
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
        this.searchLog(pager);

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
                base.searchLog(pagination);
            }
        });

    }

    getTableFooter=()=>{
        const base = this;
        return (<label>共找到<span style={{color:"#1890ff"}}> {base.state.pageInfo.total} </span>条日志信息</label>);
    }
    render=()=>{
        const {getFieldDecorator} = this.props.form; 
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '没有找到相关日志信息',
        }
        let logTypes = [];
        LogType.map((item,index)=>{
            logTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);
        })
        return (<div className="log-box">            
            <Table locale={locale} footer={this.getTableFooter} loading={this.state.loading} sorter={this.setState.sorter} pagination={this.state.pageInfo} onChange={this.handleTableChange} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
        </div>)
    }
}
const LogList = Form.create()(LogListForm);
export default LogList;