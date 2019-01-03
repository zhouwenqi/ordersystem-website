import React from 'react';
import { 
    Form, Row, Col,Select,DatePicker,Button
} from 'antd';
import { Chart, Tooltip, Axis, Legend, Bar } from 'viser-react';
import HttpUtils from '../../utils/HttpUtils';
import WebUtils from '../../utils/WebUtils';
import './charts.css';
import ChSearch from '../../components/ChSearch';

const Option = Select.Option;
const { RangePicker } = DatePicker;

/**
 * 帐务信息统计
 */
class AmountChartsForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            data:{
                totalPrice:0,
                otherPrice:0,
                actualPrice:0,
                branchBalancePrice:0,
                branchOtherPrice:0,
                actualPaymentPrice:0,
                routeQuantity:0
            },
            branchData:[],
            serarchType:'create_date',
            customerData:[]
        };
    } 
    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.getAmountChartsData(values);
            }            
        });
    }
    componentWillMount = () =>{        
        
    }
    componentDidMount = ()=>{
        this.getAmountChartsData();
    }
    /**
     * 获取帐务统计数据
     */
    getAmountChartsData(params={}){
        if(params.dates && params.dates.length===2){
            let beginDate = params.dates[0].format("YYYY-MM-DD");
            let endDate = params.dates[1].format("YYYY-MM-DD");
            params.beginDate = beginDate;
            params.endDate = endDate;
        }
        const base = this;
        HttpUtils.post('/api/order/amountCharts',params).then(function(response){
            base.setState({
                data:response.charts
            });            
        });
    }
    // 获取网点信息
    getBranchsData=(keywords)=>{
        const base = this;
        const params={keywords:keywords};
        ChSearch.branchList(params,function(list){
            base.setState({
                branchData:list,
            });
        });
    }
    onSearchBranch=(keywords)=>{
        this.getBranchsData(keywords);
    }
    onChangeType=(e)=>{
        this.setState({
            serarchType:e
        })
    }
    /**
     * 查询客户列表
     */
    handlerSearchCustomer = (keywords)=>{
        let base = this;        
        ChSearch.customerList(keywords,function(data){
            console.log("data:",data);
            base.setState({customerData:data})
        });
    }
    render = () => {
        const {getFieldDecorator} = this.props.form;
        let customerData = [];
        this.state.customerData.map((item,index)=>{            
            let customerName = WebUtils.getSelectCustomerName(item);
            customerData.push(<Option key={index} value={item.id}>{customerName}</Option>);
        });

        // 设置日期类型选择
        let dateTypes = [];        
        dateTypes.push(<Option key="create_date" value="create_date">下单时间</Option>);
        dateTypes.push(<Option key="payment_time" value="payment_time">付款时间</Option>);
        dateTypes.push(<Option key="refunds_date" value="refunds_date">回款时间</Option>);
        dateTypes.push(<Option key="user_id" value="user_id">订单来源</Option>);

        const data = [
            {"label":"总价格","合计":this.state.data.totalPrice},
            {"label":"其它费用","合计":this.state.data.otherPrice},
            {"label":"实际总额","合计":this.state.data.actualPrice},
            {"label":"与网点结算价格","合计":this.state.data.branchBalancePrice},
            {"label":"网点其它费用","合计":this.state.data.branchOtherPrice},
            {"label":"实际付款金额","合计":this.state.data.actualPaymentPrice},
        ];
        let branchDatas = [<Option key={-1} vlaue={undefined} >所有网点</Option>];
        this.state.branchData.map((item,index)=>{
            branchDatas.push(<Option key={index} value={item.id}>{item.name}</Option>);
        })

        let searchFormItem = getFieldDecorator('dates',
        {rules:[{required:false}]
        })(<RangePicker style={{marginRight:"10px"}} />);

        if(this.state.serarchType==='user_id'){
            searchFormItem = getFieldDecorator('orderUserId',
            {rules:[{required:false}]
            })(<Select showSearch showArrow={false} filterOption={false} placeholder="请选择订单来源" onSearch={this.handlerSearchCustomer} style={{marginRight:"10px",width:"300px"}}>
            {customerData}
        </Select>);
        }


        return (
            <div>
                <Form onSubmit={this.handleSubmit} size="small" style={{marginBottom:"10px"}}>
                    <Row>                    
                        <Col span={18}>
                            {getFieldDecorator('dateType',
                                {rules:[{required:false}],initialValue:'create_date'
                                })(<Select onChange={this.onChangeType.bind(this)} style={{width:"120px",marginRight:"10px"}}>
                                {dateTypes}
                                </Select>)} 
                            {searchFormItem}   
                            {getFieldDecorator('branchId',
                                {rules:[{required:false}],
                                })(<Select showArrow={false} filterOption={false} placeholder="查询网点" onSearch={this.onSearchBranch.bind(this)} style={{width:"120px",marginRight:"10px"}} showSearch>
                                {branchDatas}
                                </Select>)}                             
                            <Button loading={this.state.loading} type="primary" htmlType="submit">统计</Button>            
                        </Col>
                        <Col style={{textAlign:"right"}} span={12}></Col>
                    </Row>
                </Form>
                <div className="charts-box">
                    <div className="charts-title">帐务信息统计</div>
                    <Chart padding={[60,60]} forceFit height={500} data={data}>
                        <Tooltip />
                        <Axis />
                        <Legend position="top-center" />
                        <Bar position="label*合计" color="label" />
                    </Chart>
                </div>
            </div>
        );
    }
}

const AmountCharts = Form.create()(AmountChartsForm);
export default AmountCharts;