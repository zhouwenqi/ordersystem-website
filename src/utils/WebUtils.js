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
            case "pending":
            default:
                statusColor = "#f59e21";
                break;        
            case "ongoing":
                statusColor = "#1890ff";
                break;
            case "waitCheck":
                statusColor = "#bc15aa";
                break;
            case "complete":
                statusColor = "#19bc15";
                break;
            case "cancel":
                statusColor = "#eeeeee";
                break;
        }
        return statusColor;
    },
    getReaplceChar:(text)=>{
        if(text){
            text = text.replace(/\r/g,"&nbsp;");
            text = text.replace(/\n/g,"<br />");
        }        
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
    },
    getViewUserName:(user)=>{
        if(user){
            return user.realName+"("+user.uid+")";
        }
        return undefined;
    },
    getEnumValue:(enumHash,tag)=>{
        let enumValue = undefined;
        enumHash.map((item,index)=>{
            if(item.label===tag){
                enumValue = item.value;
            }
        });
        return enumValue;
    },
    getEnumTag:(enumHash,value)=>{
        let enumTag = undefined;
        enumHash.map((item,index)=>{            
            if(item.value === value){
                enumTag = item.label;
            }
        });
        return enumTag;
    },
    getUrlArgs:(data)=>{
        var args = []
        for(var key in data){
            if(data[key]){
                args.push(key+"="+data[key]);
            }            
        }
        var argsUrl = args.join("&");
        return argsUrl;
    },
    getTrimString:(text,length)=>{
        let content = text.substring(0,length);
        if(text.length>length){
            content += "...";
        }
        return content;

    }
}
export default WebUtils;