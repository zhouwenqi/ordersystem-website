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
        };
    } 
    /**
     * 验证表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        const base = this;
        this.props.form.validateFields((err,values) => {
            if(!err) {
                console.log(values);
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
                }
                values.beginMonth = values.beginMonth.format("YYYY-MM");
                values.endMonth = values.endMonth.format("YYYY-MM");
                HttpUtils.post('/api/order/categoryCharts',values).then(function(response){
                    if(response){
                        base.setState({
                            chartsData:response.list,
                        })                        
                    }
                });
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
        })
    }
    // 设置图表数据类型
    onChartChangeType = (e)=>{
        console.log(e);
        this.setState({
            chartsType:e.target.value,
        })
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

        const beginMonth = getFieldDecorator('beginMonth',
        {rules:[{required:false}],
        })( <MonthPicker style={{marginRight:"10px"}}
            placeholder="选择起始月份"
          />);
        const endMonth = getFieldDecorator('endMonth',
        {rules:[{required:false}],
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
        }
        if(this.state.chartsType == 'user'){
            formPanel = getFieldDecorator('totalField',
            {rules:[{required:false}],initialValue:'total_price',
            })(<Select placeholder="统计条件" style={{width:"200px",marginRight:"10px"}}>
            {priceTypes}
            </Select>);
        }
        const chartsData = this.state.chartsData;
        const dv = new DataSet.View().source(chartsData);
        dv.transform({
        type: 'fold',
        
        key: '月份',
        value: '月均降雨量',
        });
        const data = dv.rows;
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
                    <div className="charts-title">帐务信息统计</div>
                    <Chart forceFit height={400} data={chartsData}>
                        <Tooltip />
                        <Axis />
                        <Legend />
                        <Bar position="totalMonth*totalPrice" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
                    </Chart>
                </div>
            </div>
        );
    }
}

const CateGoryCharts = Form.create()(CategoryChartsForm);
export default CateGoryCharts;