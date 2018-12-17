import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Form,Icon, Row, Table,Modal,Col,Select,DatePicker,Button,Radio,message
} from 'antd';
import { Chart, Tooltip, Axis, Legend, Bar} from 'viser-react';
import HttpUtils from '../../utils/HttpUtils';
import Moment from 'moment';
import './charts.css';
import ChSearch from '../../components/ChSearch';
import PriceType from '../../common/PriceType';

const DataSet = require('@antv/data-set');
const Option = Select.Option;
const { RangePicker,MonthPicker  } = DatePicker;

/**
 * 分类帐务统计
 */
class CategoryChartsForm extends React.Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            loading:false,
            chartsType:'month',
            branchData:[],
            chartsData:[],
            beginMonth:Moment(new Date()).subtract(6, "months"),
            endMonth:Moment(new Date()),
        };
    }

    getEndMonth=()=>{
        const date = new Date();
        date.setMonth(-3);
    }

    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        const base = this;
        this.props.form.validateFields((err,values) => {
            if(!err) {
                base.onSearchChartsData(values);
            }            
        });
    }
    /**
     * 查询报表数据
     */
    onSearchChartsData=(values={})=>{  
        if(values.type==='month') {
            if(!values.endMonth || !values.beginMonth){
                message.warning("请选择月份间隔");
                return;
            }
            const diffx = values.endMonth.diff(values.beginMonth,'month');
            if(diffx <=0 || diffx>7){
                message.warning("月份间差必须大于0和小于7");
                return;
            }
            values.beginMonth = values.beginMonth.format("YYYY-MM");
            values.endMonth = values.endMonth.format("YYYY-MM"); 
        }else if(values.type==='branch'){
            if(!values.branchIds || values.branchIds.length<=0){
                message.warning("网点必须大于0和小于7");
                return;
            }
            values.beginMonth = undefined;
            values.endMonth = undefined;
        }
        else if(values.type==='user'){            
            values.beginMonth = undefined;
            values.endMonth = undefined;
        }
        const base = this;           
        HttpUtils.post('/api/order/categoryCharts',values).then(function(response){
            if(response){
                base.setState({
                    chartsData:response.list,
                })                        
            }
        });
    }
    componentWillMount = () =>{        
        
    }
    componentDidMount = ()=>{
        this.getBranchData();
    }    
    
    // 获取网点信息
    getBranchData=()=>{
        const base = this;
        ChSearch.branchList(function(list){
            base.setState({
                branchData:list,
            });
            const params = {
                type:base.state.chartsType,
                beginMonth:base.state.beginMonth,
                endMonth:base.state.endMonth,
            }
            base.onSearchChartsData(params);
        })
    }
    // 设置图表数据类型
    onChartChangeType = (e)=>{
        e.preventDefault();
        this.setState({
            chartsData:[],
            chartsType:e.target.value,
        });
    }
    onGetChartsData=(data)=>{
        let chartData = [];
        if(this.state.chartsType==='month'){            
            for(var i=0;i<data.length;i++){
                chartData = chartData.concat(this.onGetChartMonthItem(data[i]));
            }
            return chartData;
        }else if(this.state.chartsType==='branch'){
            for(var i=0;i<data.length;i++){
                chartData = chartData.concat(this.onGetChartBranchItem(data[i]));
            }
            return chartData;
        }else if(this.state.chartsType==='user'){
            for(var i=0;i<data.length;i++){
                chartData = chartData.concat(this.onGetChartUserItem(data[i]));
            }
            return chartData;
        }
    }
    
    onGetChartMonthItem=(item)=>{        
        let data = [
            {
                "月份":item.totalMonth,
                "金额类型":"总价格",
                "值":item.totalPrice,
            },
            {
                "月份":item.totalMonth,
                "金额类型":"其它费用",
                "值":item.otherPrice,
            },
            {
                "月份":item.totalMonth,
                "金额类型":"实际总额",
                "值":item.actualPrice,
            },
            {
                "月份":item.totalMonth,
                "金额类型":"与网点结算价格",
                "值":item.branchBalancePrice,
            },
            {
                "月份":item.totalMonth,
                "金额类型":"网点其它费用",
                "值":item.branchOtherPrice,
            },
            {
                "月份":item.totalMonth,
                "金额类型":"实际付款金额",
                "值":item.actualPaymentPrice,
            },
        ];
        return data;
    }

    onGetChartBranchItem=(item)=>{        
        let data = [
            {
                "网点":item.branchName,
                "金额类型":"总价格",
                "值":item.totalPrice,
            },
            {
                "网点":item.branchName,
                "金额类型":"其它费用",
                "值":item.otherPrice,
            },
            {
                "网点":item.branchName,
                "金额类型":"实际总额",
                "值":item.actualPrice,
            },
            {
                "网点":item.branchName,
                "金额类型":"与网点结算价格",
                "值":item.branchBalancePrice,
            },
            {
                "网点":item.branchName,
                "金额类型":"网点其它费用",
                "值":item.branchOtherPrice,
            },
            {
                "网点":item.branchName,
                "金额类型":"实际付款金额",
                "值":item.actualPaymentPrice,
            },
        ];
        return data;
    }

    onGetChartUserItem=(item)=>{        
        let data = [
            {
                "用户":item.uid,
                "金额类型":"总价格",
                "值":item.totalPrice,
            },
            {
                "用户":item.uid,
                "金额类型":"其它费用",
                "值":item.otherPrice,
            },
            {
                "用户":item.uid,
                "金额类型":"实际总额",
                "值":item.actualPrice,
            },
            {
                "用户":item.uid,
                "金额类型":"与网点结算价格",
                "值":item.branchBalancePrice,
            },
            {
                "用户":item.uid,
                "金额类型":"网点其它费用",
                "值":item.branchOtherPrice,
            },
            {
                "用户":item.uid,
                "金额类型":"实际付款金额",
                "值":item.actualPaymentPrice,
            },
        ];
        return data;
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;
        let branchDatas = [];
        this.state.branchData.map((item,index)=>{
            branchDatas.push(<Option key={index} value={item.id}>{item.name}</Option>);
        });
        let priceTypes = [];
        PriceType.map((item,index)=>{
            priceTypes.push(<Option key={index} value={item.value}>{item.label}</Option>);

        });

        let barItem = <Bar position="月份*值" color="金额类型" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
        const beginMonth = getFieldDecorator('beginMonth',
        {rules:[{required:false}],initialValue:this.state.beginMonth
        })( <MonthPicker style={{marginRight:"10px"}}
            placeholder="选择起始月份"
          />);
        const endMonth = getFieldDecorator('endMonth',
        {rules:[{required:false}],initialValue:this.state.endMonth
        })( <MonthPicker style={{margin:"0px 10px"}}
            placeholder="选择结束月份"
          />);
        
        let formPanel = <React.Fragment>{beginMonth}<label>至</label>{endMonth}</React.Fragment>;

        if(this.state.chartsType == 'branch'){
            formPanel = getFieldDecorator('branchIds',
            {rules:[{required:false,message:"请选择要统计的网点（一般选多个）"}],
            })(<Select maxTagCount = {6} mode="multiple" placeholder="选择网点" style={{width:"500px",marginRight:"10px"}}>
            {branchDatas}
            </Select>);
            barItem = <Bar position="网点*值" color="金额类型" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
        }
        if(this.state.chartsType == 'user'){
            const totalField = getFieldDecorator('totalField',
            {rules:[{required:false}],initialValue:'totalPrice',
            })(<Select placeholder="统计条件" style={{width:"200px",marginRight:"10px"}}>
            {priceTypes}
            </Select>);
            const totalMethod = getFieldDecorator('totalMethod',
            {rules:[{required:false}],initialValue:'max',
            })(<Select placeholder="统计条件" style={{width:"200px",marginRight:"10px"}}>
            <Option key={0} value="min">前6位</Option>
            <Option key={1} value="max">后6位</Option>
            </Select>);
            formPanel = <React.Fragment>{totalField}{totalMethod}</React.Fragment>
            barItem = <Bar position="用户*值" color="金额类型" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
        }
        const chartsData = this.onGetChartsData(this.state.chartsData);        
        return (
            <div>
                <Form onSubmit={this.handleSubmit} size="small" style={{marginBottom:"10px"}}>
                    <Row>                    
                        <Col span={18}>                                  
                            {formPanel}
                            <Button loading={this.state.loading} type="primary" htmlType="submit">统计</Button>
                        </Col>

                        <Col span={6} style={{textAlign:"right"}}>
                            {getFieldDecorator('type',
                                {rules:[{required:false}],initialValue:'month'
                                })(<Radio.Group onChange={this.onChartChangeType} style={{marginRight:"10px"}}>
                                    <Radio.Button value="month">按月份</Radio.Button>
                                    <Radio.Button value="branch">按网点</Radio.Button>
                                    <Radio.Button value="user">按用户</Radio.Button>
                                    </Radio.Group>)} 
                        </Col>
                    </Row>
                </Form>
                <div className="charts-box">
                    <div className="charts-title">分类帐务统计</div>
                    <Chart forceFit height={500} data={chartsData}>
                        <Tooltip />
                        <Axis />
                        <Legend />
                        {barItem}
                    </Chart>
                </div>
            </div>
        );
    }
}

const CateGoryCharts = Form.create()(CategoryChartsForm);
export default CateGoryCharts;