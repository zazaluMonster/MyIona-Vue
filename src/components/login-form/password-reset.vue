<style scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.span-gray {
  color: #acb0b8;
}
.span-yellow {
  color: #ffbf00;
}
.span-green {
  color: #1fc063;
}
.radioGroup {
  margin-left: 15px;
}
.disappear {
  display: none;
}
.show {
  display: block;
}
</style>
<template>
  <Drawer
    title="重新设置密码:)"
    v-model="show"
    width="720"
    :mask-closable="false"
    :styles="styles"
    placement="left"
  >
    <Form ref="passwordResetForm" :model="formData" :rules="rules">
      <Row :gutter="32">
        <FormItem label prop="useType">
          <RadioGroup v-model="formData.useType" class="radioGroup" @on-change="onRadioChange">
            <Radio label="usePhone">使用手机号重设</Radio>
            <Radio label="useMail">使用邮箱重设</Radio>
          </RadioGroup>
        </FormItem>
        <i-col span="12">
          <FormItem label="邮箱" label-position="top" prop="mail" :class="mailInputClass">
            <!-- <i-input v-model="formData.mail" placeholder="请输入您当时注册的邮箱">
            </i-input> -->
            <AutoComplete v-model="formData.mail" @on-search="handleMailSuffix" placeholder="请输入您当时注册的邮箱">
              <Option v-for="item in mailSuffixs" :value="item" :key="item">{{ item }}</Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="手机号" label-position="top" prop="phoneNum" :class="phoneInputClass">
            <i-input v-model="formData.phoneNum" placeholder="请输入您当时注册的手机号">
              <span slot="prepend">86</span>
            </i-input>
          </FormItem>
        </i-col>
      </Row>
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="旧密码" label-position="top" prop="oldPassword">
            <i-input type="password" v-model="formData.oldPassword" placeholder="请输入您的旧密码"></i-input>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="新密码" label-position="top" prop="newPassword">
            <i-input
              type="password"
              v-model="formData.newPassword"
              placeholder="请输入您的旧密码"
              @on-change="passwordLevelCheck"
            >
              <span slot="append" :class="classes.spanColor">{{curPasswordLevel}}</span>
            </i-input>
          </FormItem>
        </i-col>
      </Row>
      <FormItem label="验证码" label-position="top" prop="verifyCode">
        <i-input v-model="formData.verifyCode" placeholder="请输入我们发送给您的6位验证码" style="width: 120px" />
        <Button style="margin-left: 10px" @click="getVerificationCode">获取验证码</Button>
      </FormItem>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="show = false">取消</Button>
      <Button type="primary" @click="submit">提交</Button>
    </div>
  </Drawer>
</template>

<script>
import md5 from "md5";
import { post } from "@/util/httpUtil.js";
import jsonManager from "json5";

var verifyCode = "";
const verifyCodePass = (rule, value, callback) => {
  if (value != verifyCode) {
    callback(new Error("验证码错误"));
  } else {
    callback();
  }
};

export default {
  name: "PasswordReset",
  props: {
    useTypeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "请选择重设方式", trigger: "change" }
        ];
      }
    },
    mailRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "邮箱不能为空", trigger: "blur" }];
      }
    },
    oldPasswordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "旧密码不能为空", trigger: "blur" }];
      }
    },
    newPasswordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "新密码不能为空", trigger: "blur" }];
      }
    },
    phoneRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "手机不能为空", trigger: "blur" },
          {
            type: "string",
            pattern: /^[0-9]+$/,
            message: "请输入数字!",
            trigger: "blur"
          },
          { max: 11, message: "目前中国手机号不超过11位" }
        ];
      }
    },
    verifyCodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            type: "string",
            pattern: /^[0-9]+$/,
            message: "验证码格式错误",
            trigger: "blur"
          },
          { max: 6, message: "验证码长度错误" },
          { validator: verifyCodePass, trigger: "blur" }
        ];
      }
    }
  },
  data() {
    return {
      show: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      mailInputClass: "",
      phoneInputClass: "",
      useTypeList: {
        phone: "usePhone",
        mail: "useMail"
      },
      passwordLevel: {
        low: "弱",
        lowClasses: "span-gray",
        middle: "中",
        middleClasses: "span-yellow",
        high: "强",
        highClasses: "span-green"
      },
      curPasswordLevel: "",
      classes: {
        spanColor: "",
        disappear: "disappear",
        show: "show"
      },
      formData: {
        useType: "",
        mail: "",
        phoneNum: "",
        oldPassword: "",
        newPassword: "",
        verifyCode: ""
      },
      mailSuffixs: []
    };
  },
  created: function() {
    //初始化默认选中手机号重设
    this.formData.useType = this.useTypeList.phone;
    this.usePhone();
  },
  computed: {
    rules() {
      return {
        useType: this.useTypeRules,
        mail: this.mailRules,
        phoneNum: this.phoneRules,
        oldPassword: this.oldPasswordRules,
        newPassword: this.newPasswordRules,
        verifyCode: this.verifyCodeRules
      };
    }
  },
  methods: {
    submit: function() {
      this.$refs.passwordResetForm.validate(valid => {
        if (valid && this.passwordCompare()) {
          this.$emit("on-success-valid", {
            useType: this.formData.useType,
            mail: this.formData.mail,
            phoneNum: this.formData.phoneNum,
            oldPassword: md5(this.formData.oldPassword),
            newPassword: md5(this.formData.newPassword),
            verifyCode: this.formData.verifyCode
          });
        }
      });
    },
    getVerificationCode: function() {
      let phoneNum = this.formData.phoneNum;
      let mail = this.formData.mail;

      //给手机发送验证码
      if (this.formData.useType == this.useTypeList.phone) {
        post(
          global.$prop.URL.getVerificationCode,
          { phoneNum: phoneNum },
          this.verificationResponse
        );
      }
      //给邮箱发送验证码
      else{
         post(
          global.$prop.URL.getVerificationCodeToMail,
          { mail: mail },
          this.verificationResponse
        ); 
      }

    },
    verificationResponse: function(responseData) {
      verifyCode = responseData.verifyCode;
      global.$util.successNotice("短信验证码：" + verifyCode);
    },
    passwordLevelCheck: function(params) {
      var specialSymbols = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      );

      var capital = /[A-Z]/;

      //不带特殊字符和大写字母，强度为弱
      if (
        !specialSymbols.test(this.formData.password) &&
        !capital.test(this.formData.password)
      ) {
        this.curPasswordLevel = this.passwordLevel.low;
        this.classes.spanColor = this.passwordLevel.lowClasses;
      }

      //带有特殊字符或者大写字母，强度提升到中
      if (
        specialSymbols.test(this.formData.password) ||
        capital.test(this.formData.password)
      ) {
        this.curPasswordLevel = this.passwordLevel.middle;
        this.classes.spanColor = this.passwordLevel.middleClasses;
      }

      //特殊字符和大写字母都包含,强度提升到强
      if (
        specialSymbols.test(this.formData.password) &&
        capital.test(this.formData.password)
      ) {
        this.curPasswordLevel = this.passwordLevel.high;
        this.classes.spanColor = this.passwordLevel.highClasses;
      }
    },
    onRadioChange(param) {
      if (this.useTypeList.phone === param) {
        this.usePhone();
      } else {
        this.useMail();
      }
    },
    usePhone: function() {
      this.mailInputClass = this.classes.disappear;
      this.phoneInputClass = this.classes.show;
      this.formData.mail = " "; //预设内容，防止验证不通过
      this.formData.phoneNum = ""; //预设内容，防止验证不通过
    },
    useMail: function() {
      this.phoneInputClass = this.classes.disappear;
      this.mailInputClass = this.classes.show;
      this.formData.phoneNum = "00000000000"; //预设内容，防止验证不通过
      this.formData.mail = ""; //预设内容，防止验证不通过
    },
    passwordCompare: function() {
      if (this.formData.oldPassword === this.formData.newPassword) {
        global.$util.errorNotice("新旧密码不能一致");
        return false;
      } else {
        return true;
      }
    },
    handleMailSuffix(value) {
      this.mailSuffixs =
        !value || value.indexOf("@") >= 0
          ? []
          : [value + "@qq.com", value + "@sina.com", value + "@163.com", value + "@gmail.com"];
    }
  }
};
</script>

<style>
</style>

