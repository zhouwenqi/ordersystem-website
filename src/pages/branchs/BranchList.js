import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Form,Icon, Row, Table,Modal,
} from 'antd';
import HttpUtils from '../../utils/HttpUtils';
import ChSearch from '../../components/ChSearch';

import './branch.css';

const Confirm = Modal.confirm;

/**
 * 网点列表
 */
class BranchListForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            user:null,
            loading:false,
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
        this.getBranchData();
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
     * 获取网点数据
     */
    getBranchData=()=>{
        const base = this;
        base.setState({
            loading:true,
        });
        ChSearch.branchList(function(list){
            base.setState({
                dataSource:list,
                loading:false
            });
        });
    }
    render=()=>{
        return (<div className="branch-box">
            <Table loading={this.state.loading} pagination={false} rowKey="id" size="small" columns={this.dataColumns} dataSource={this.state.dataSource} bordered />
        </div>)
    }
}
const BranchList = Form.create()(BranchListForm);
export default BranchList;