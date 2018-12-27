import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * 首页订单统计状态标签
 */
class OrderStatusTotal extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            data:this.props.data
        };
    } 
    static contextTypes = {
        menuRoute:PropTypes.func
    }
    render=()=>{
        let divStyle = {
            flex:"1"
        }
        const data = this.props.data;
        let color = "#ff6600";
        switch(data.status){
            case "pending":
                color = "#f59e21";
                break;
            case "ongoing":
                color = "#1890ff";
                break;
            case "waitCheck":
                color = "#bc15aa";
                break;
            case "complete":
                color = "#19bc15";
                break;
            case "cancel":
                color = "#eeeeee";
                break;
            case "all":
                color = "#ff5b5b";
                divStyle = {
                    width:"50%",
                    paddingTop:"30px"
                }
                break;
            case "new":
                color = "#46f0ff";
                divStyle = {
                    width:"50%",
                    paddingTop:"30px"
                }
                break;
            default:
                break;

        }
        const spanStyle = {
            color:color
        }
        return (
            <div style={divStyle} className="grid-item">
                <label>{data.tag}</label><br />
                <span style={spanStyle}>{data.count}</span>
            </div>);
    }
}
export default OrderStatusTotal;
