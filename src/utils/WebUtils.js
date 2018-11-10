const WebUtils = {
    getRouteName:(e)=>{
        var reg = new RegExp( '/' , "g" );
        return e.substring(1,e.length).replace(reg,".");
    }
}
export default WebUtils;