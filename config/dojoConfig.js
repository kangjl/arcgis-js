/**
 * Created by Forget7 on 2016/5/30.
 */
var dojoConfig = {
    async:true,
    parseOnLoad:true,
    serverIP:window.location.host,
    paths:{
        // esricd 的名称不能被修改
        esricd:location.pathname.replace(/\/[^/]+$/, "") +"extra"
    }
};