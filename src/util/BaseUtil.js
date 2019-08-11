import jsonManager from "json5";
import iView from 'iview';
import router from "@/router.js";


var util = {
    debug: global.$prop.DEBUG,
    logger(msg) {
        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(msg);
        }
    },
    //不考虑DEBUG模式，始终进行Log输出
    consoleLog(msg) {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
    compare(obj1, obj2) {
        if (obj1 == obj2) {
            return true;
        } else {
            return false;
        }
    },
    equals(obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        } else {
            return false;
        }
    },
    responseResolve(response, data, successFunction, successStatus, errorFunction) {
        let responseData = this.parseJson(response.data)
        if (successStatus == undefined) {
            successStatus = global.$prop.HTTP_STATUS.OK;
        }

        if (responseData.status === successStatus) {
            successFunction(data.crewName, responseData);
        } else {
            if (errorFunction == undefined) {
                this.errorNotice(responseData.msg);
            } else {
                errorFunction(responseData);
            }
        }
    },
    successNotice(title, desc) {
        if (desc == undefined) {
            desc = "";
        }
        iView.Notice.success({
            title: title,
            desc: desc
        });
    },
    errorNotice(title, desc) {
        if (desc == undefined) {
            desc = "";
        }
        iView.Notice.error({
            title: title,
            desc: desc
        });
    },
    parseJson(jsonData) {
        let responseData = jsonManager.parse(jsonData);
        return responseData
    },
    routerPush(name) {
        router.push({ "name": name });
    },
    routerPushForPath(path) {
        router.push({ path: path });
    },
    routerPushRestful(pushData) {
        router.push(pushData);
    },
    updateAvatarUrl(vuexStore, avatar) {
        if (avatar.trim().length!=0) {
            //尾部添加随机数来强制刷新图片,不走缓存
            let version = "?version=" + Math.random();
            let newAvatarUrl = "";
            if (global.$prop.DEBUG) {
                newAvatarUrl =
                    global.$prop.DEV_BASEURL + avatar + version;
            } else {
                newAvatarUrl =
                    global.$prop.PROD_BASEURL + avatar + version;
            }
            //全局更新头像url
            vuexStore.commit("changeAvatarUrl", newAvatarUrl);
        }
        //不带头像就更新成默认头像
        else{
            vuexStore.commit("changeAvatarUrl", require('../assets/avatar/avatar.jpg'));
        }
    },
    getAvatarUrl(avatarName){
        if (avatarName.trim().length!=0) {
            //尾部添加随机数来强制刷新图片,不走缓存
            let version = "?version=" + Math.random();
            let newAvatarUrl = "";
            if (global.$prop.DEBUG) {
                newAvatarUrl =
                    global.$prop.DEV_BASEURL + avatarName + version;
            } else {
                newAvatarUrl =
                    global.$prop.PROD_BASEURL + avatarName + version;
            }
            return newAvatarUrl;
        }
    }
}

export {
    util
}