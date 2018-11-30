import httpUtil from '../utils/HttpUtils';

let timeout;
let currentKeywords;

/**
 * 统一查询方法
 */
class ChSearch {
    /**
     * 查询客户列表
     */
    customerList = (keywords,func) => {
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        currentKeywords = keywords;
        function getCustomerData(){
            let params={role:"customer",akName:keywords};
            httpUtil.get("/api/user/list",{params:params}).then(function(response){
                if(response && currentKeywords===keywords){
                    console.log(response.list);
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getCustomerData,300);
    }
    /**
     * 查询内部人员列表
     */
    employeeList = (keywords,func)=>{
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        currentKeywords = keywords;
        function getEmployeeData(){
            let params={role:"employee",akName:keywords};
            httpUtil.get("/api/user/list",{params:params}).then(function(response){
                if(response && currentKeywords===keywords){
                    console.log(response.list);
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getEmployeeData,300);
    }
}
export default new ChSearch();