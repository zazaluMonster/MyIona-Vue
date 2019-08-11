import router from '@/router.js'
import jsonManager from "json5";
import {setCookie,getCookie} from "@/util/httpUtil.js";

export function manageLoginCookie(crewName, token) {
    if (token != null && token.trim().length != 0) {
        let time = global.$prop.TOKEN_LIVE_TIME * 24 * 60 * 60 * 1000
        setCookie(crewName + global.$prop.COOKIE_SUFFIX, token, time);
        setCookie(global.$prop.COOKIE_USERNAME, crewName, time);
    }else{
        global.$util.errorNotice("token无效");
    }
}
/**
 * 前端登录会话验证,发送请求前判断是否有登录凭证（不可靠检查，但是可以有效减少请求次数，降低服务器压力）
 * @param {*} config axios配置
 * @param {*} source axios取消控制器
 */
export function fontLoginAuth(config) {
    let crewName = getCookie(global.$prop.COOKIE_USERNAME);
    let token = getCookie(crewName + global.$prop.COOKIE_SUFFIX);
    config.headers['Authorization'] = encodeURIComponent(token);
    if(checkNologinUrl(config.url)){
        return true;
    }
    // 检查token
    if (token == "") {
        jumpToLogin();
        return false;
    }else{
        return true;
    }
}

//判断是否需要进行身份验证 
export function checkNologinUrl(currentUrl){
    let noLoginUrl = global.$prop.NO_LOGIN_URL;
    for (const key in noLoginUrl) {
        if (noLoginUrl.hasOwnProperty(key)) {
            const url = noLoginUrl[key];
            if(currentUrl == url){
                global.$util.logger(url + "无需进行身份验证")
                return true;
            }
        }
    }
}

/**
 * 后端登录验证，后端的登录验证结果（可靠检查，由后端进行的登录验证）
 * @param {*} response 请求response
 */
export function backLoginAuth(response,currentUrl) {
    if(checkNologinUrl(currentUrl)){
        return;
    }
    let responseData = jsonManager.parse(response.data);
    if (responseData.status == global.$prop.HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED) {
        jumpToLogin()
    }
}

function jumpToLogin(){
  // 未登录,跳转至login
  router.push({ name: "login" })
}


/**
 * 将token信息注入所有请求的data信息中
 * @param {*} data axios请求数据
 */
export function injectionToken(data) {
    let crewName = getCookie(global.$prop.COOKIE_USERNAME);
    data.token = getCookie(crewName + global.$prop.COOKIE_SUFFIX);
}

/**
 * 获取当前登录的用户的用户名
 */
export function getLoginUserName(){
    let name = getCookie(global.$prop.COOKIE_USERNAME);
    return name;
}