import { Message } from 'antd';
import axios from 'axios';
import qs from 'qs'
const axiosService = axios.create({
    baseURL:'http://localhost:9018',
    timeout:20000
})
axiosService.interceptors.request.use(
    config => {
        config.headers['ch-token'] = window.config.token;
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if(config.method==='post' || config.method==='put'){
            config.data = qs.stringify(config.data);
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);    
    }   
);
axiosService.interceptors.response.use(
    response => {        
        var resultData = null;
        if(response.data!==undefined){
            resultData = response.data;
        }
        if(resultData !== null){
            if(resultData.code!==200){
                Message.warning(resultData.msg);
                return;
            }
            if(resultData.data!==undefined && resultData!=null){
                return resultData.data;
            }
            return {};
        }
    },
    error => {
        var errMsg = "请求网络错误";
        if(error.response){
            var code = error.response.status;
            if(code===700 || code === 701 || code === 702 || code === 900 || code === 901 || code === 902){
                errMsg = error.response.data.msg;
            }
        }        
        Message.error(errMsg);
    }
);
export default axiosService;