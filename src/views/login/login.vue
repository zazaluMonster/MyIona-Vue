<style lang="less">
@import "./login.less";

.oprationP {
  text-align: right !important;
  font-size: 12px !important;
}

.register {
  color: #20bd0d !important;
}

.forgetPassword {
  color: rgb(84, 110, 122);
  float: left;
}

.oprationIcon {
  font-size: 17px !important;
}
.cursor {
  cursor: pointer;
}

.login-backgroud-img {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>

<template>
  <div class="login">
    <img class="login-backgroud-img" v-lazy="src" />
    <div class="login-con">
      <Card icon="log-in" title="MyIona" :bordered="false">
        <div class="form-con">
          <login-form ref="loginForm" @on-success-valid="handleLogin"></login-form>
          <p class="login-tip oprationP">
            <span class="cursor register" @click="startRegister">
              <Icon type="ios-contact" class="oprationIcon cursor" />注册
            </span>
            <span class="cursor forgetPassword" @click="startPasswordReset">
              忘记密码
            </span>
          </p>
        </div>
      </Card>
      <login-circle ref="myCircle"></login-circle>
      <login-register ref="myRegister" @on-success-valid="handleRegister"></login-register>
      <password-reset ref="myPasswordReset" @on-success-valid="handlePasswordReset"></password-reset>
    </div>
  </div>
</template>

<script>
import LoginForm from "../../components/login-form/login-form";
import LoginCircle from "../../components/login-form/login-circle";
import LoginRegister from "../../components/login-form/login-register";
import PasswordReset from "../../components/login-form/password-reset";
import { post } from "@/util/httpUtil.js";
import { manageLoginCookie } from "@/controller/login.js";
import sleep from "sleepjs";
export default {
  data() {
    return {
      src: require("../../assets/images/login-bg.jpg")
    };
  },
  components: {
    LoginForm,
    LoginCircle,
    LoginRegister,
    PasswordReset
  },
  methods: {
    // 登录
    async handleLogin(data) {
      //为了演示加载转圈特效,延迟请求发送(只适用于开发模式下)
      this.$refs.myCircle.loading();
      if (global.$prop.DEBUG) {
        await sleep(2000);
      }
      post(global.$prop.URL.login, data, this.loginResponse, this.loginError);
    },
    loginResponse(responseData, data) {
      this.loginSuccess(data.crewName, responseData);
    },
    loginSuccess(crewName, responseData) {
      manageLoginCookie(crewName, responseData.token);
      global.$util.routerPush("伊友动态");
    },
    loginError() {
      this.$refs.myCircle.wait();
    },
    // 注册
    startRegister() {
      this.openRegisterPanel();
    },
    startPasswordReset() {
      this.openPasswordResetPanel();
    },
    handleRegister(data) {
      global.$util.logger("准备提交注册");
      post(global.$prop.URL.register, data, this.registerResponse);
    },
    registerResponse(responseData, data) {
      global.$util.successNotice("注册成功");
      this.$refs.loginForm.form.userName = data.crewName;
      this.$refs.loginForm.form.password = "";
      this.closeRegisterPanel();
    },
    handlePasswordReset(data){
      global.$util.logger("准备更改密码");
      post(global.$prop.URL.passwordReset, data, this.passwordResetResponse);
    },
    passwordResetResponse(responseData,data){
      global.$util.successNotice("密码修改成功");
      this.closePasswordResetPanel();
    },
    // 其他操作
    openRegisterPanel() {
      this.$refs.myRegister.show = true;
    },
    closeRegisterPanel() {
      this.$refs.myRegister.show = false;
    },
    openPasswordResetPanel(){
      this.$refs.myPasswordReset.show = true;
    },
    closePasswordResetPanel() {
      this.$refs.myPasswordReset.show = false;
    },
  }
};
</script>

<style>
</style>
