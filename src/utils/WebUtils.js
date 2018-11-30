const WebUtils = {
    getRouteName:(e)=>{
        var reg = new RegExp( '/' , "g" );
        return e.substring(1,e.length).replace(reg,".");
    },
    getHumpString:(field)=>{
        return field.replace(/([A-Z])/g,"_$1").toLowerCase();
    },
    getOrderStatusColor:(orderStatus)=>{
        let statusColor = "#999999";
        switch (orderStatus) {
            case "待派单":
            default:
                statusColor = "#f59e21";
                break;        
            case "跟进中":
                statusColor = "#1890ff";
                break;
            case "待验收":
                statusColor = "#bc15aa";
                break;
            case "已完结":
                statusColor = "#19bc15";
                break;
            case "已取消":
                statusColor = "#eeeeee";
                break;
        }
        return statusColor;
    },
    getReaplceChar:(text)=>{
        text = text.replace(/\r/g,"&nbsp;");
        text = text.replace(/\n/g,"<br />");
        return text;
    },
    getSelectCustomerName:(user)=>{
        let company = user.company;
        if(company===undefined || company===null || company===''){
            company = user.realName;
        }else{
            company = user.realName + "["+company+"]";
        }
        let customerName = company+" - "+user.uid;
        return customerName;
    }
}
export default WebUtils;