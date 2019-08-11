import axios from 'axios';
import { fontLoginAuth, backLoginAuth } from '@/controller/login.js'

// axios全局配置
if(global.$prop.DEBUG){
    //测试环境
    axios.defaults.baseURL = global.$prop.DEV_BASEURL;
}else{
    //生产环境
    axios.defaults.baseURL = global.$prop.PROD_BASEURL;
}

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = "application/json";

// 创建axios实例
const originalAxios = axios.create({
    timeout: global.$prop.AXIOS_TIME_OUT,
    // 在返回函数调用之前
    transformResponse: [function (data) {
        global.$util.logger(data)
        return data;
    }]
});

// 会话管理拦截器
originalAxios.interceptors.request.use(function (config) {
    //前端登录验证
    if(!fontLoginAuth(config)){
        global.$util.errorNotice("登录验证失败");
        return false;
    }else{
        return config;
    }
}, function (error) {
    return Promise.reject(error);
});


/**
 * 发送POST请求
 * @param {*} url 发送请求url
 * @param {*} data 发送的请求数据
 * @param {*} thenFunction then函数
 * @param {*} errorFunction 自定义error函数,执行一些自定义的error行为.
 * @param {*} beforeThenFunction Then函数执行之前的钩子函数,默认执行doNothing
 * @param {*} beforePostFunction Post请求提交之前的钩子函数,默认执行doNothing
 * @param {*} catchFunction catch函数,默认执行doNothing
 */
export function post(url, data = {}
    , thenFunction
    , errorFunction = doNothing
    , beforeThenFunction = backLoginAuth
    , beforePostFunction = doNothing
    , catchFunction = doNothing) {
    beforePostFunction(data);
    originalAxios.post(url, data)
        .then(function (response) {
            //处理登录验证等
            beforeThenFunction(response, url);
            //统一处理返回码
            let flag = false;
            let responseData = global.$util.parseJson(response.data)
            if (responseData.status === global.$prop.HTTP_STATUS.OK) {
                flag = true;
            }else if(responseData.status !== global.$prop.HTTP_STATUS.OK){
                flag = false;
                
            }
            if(flag){
                thenFunction(responseData, data);
            }
            //提示后台发送的错误码内容
            else{
                errorFunction();
                global.$util.errorNotice(responseData.msg);
            }
        })
        .catch(function (error) {
            global.$util.logger(error)
            catchFunction(error);
            axiosError(error)
        });
}

function doNothing() {
}
function axiosError(error) {
    //若是系统报错,则提示在控制台
    if(error.name.includes("TypeError")){
        global.$util.logger("拦截器已取消正在执行的请求");
    }else{
        global.$util.errorNotice(error)
    }
}


export function setCookie(cname, cvalue, timeMillis) {
    //说明已登录过，清除这些登录信息
    if (getCookie(cname) != "") {
        global.$util.logger("cookie已存在,进行清除")
        delCookie(cname)
    }

    var d = new Date();
    d.setTime(d.getTime() + timeMillis);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; //指定cookie路径很重要
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

export function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
}

/**
 * 导出原生axios实例供一些小伙伴使用(你也许看不懂我的封装api，但是你肯定知道axios的api)
 */
export {
    originalAxios
}