import HttpUtil from '../utils/HttpUtils';

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
            let params={role:"customer",keywords:keywords,pageSize:20,pageNumber:1,sortField:'create_date',sortDirection:'desc'};
            HttpUtil.get("/api/user/list",{params:params}).then(function(response){
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
    employeeList = (func)=>{
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        function getEmployeeData(){
            let params={role:"employee,manager"};
            HttpUtil.get("/api/user/list",{params:params}).then(function(response){
                if(response){
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getEmployeeData,300);
    }
    /**
     * 查询网点负责人列表
     */
    branchsUserList = (func)=>{
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        function getEmployeeData(){
            let params={role:"branchs"};
            HttpUtil.get("/api/user/list",{params:params}).then(function(response){
                if(response){
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getEmployeeData,300);
    }
    /**
     * 获取网点列表
     */
    branchList = (func) => {
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        function getBranchData(){
            HttpUtil.get("/api/branch/list").then(function(response){
                if(response){
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getBranchData,300);
    }
    /**
     * 获取网点工程师列表
     */
    enginnerList = (branchId,func) => {
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        function getEnginnerData(){
            const params = {branchId:branchId};
            HttpUtil.get("/api/user/listByBranch",{params:params}).then(function(response){
                if(response){
                    func(response.list);
                }
            });
        }
        timeout = setTimeout(getEnginnerData,300);
    }
}
export default new ChSearch();