<style>
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
</style>
<template>
  <Drawer
    title="欢迎来到Myionavue,请填写以下内容完成注册：）"
    v-model="show"
    width="720"
    :mask-closable="false"
    :styles="styles"
    placement="left"
  >
    <Form ref="registerForm" :model="formData" :rules="rules">
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="昵称" label-position="top" prop="crewName">
            <i-input v-model="formData.crewName" placeholder="首先让MyIona知道你是谁" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="邮箱" label-position="top" prop="mail">
            <!-- <i-input v-model="formData.mail" placeholder="邮箱是重要的联系方式">
            </i-input> -->
            <AutoComplete v-model="formData.mail" @on-search="handleMailSuffix" placeholder="请输入您当时注册的邮箱">
              <Option v-for="item in mailSuffixs" :value="item" :key="item">{{ item }}</Option>
            </AutoComplete>
          </FormItem>
        </i-col>
      </Row>
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="密码" label-position="top" prop="password">
            <i-input
              type="password"
              v-model="formData.password"
              placeholder="2019年了你喜欢密码还是验证码登录？"
              @on-change="passwordLevelCheck"
            >
              <span slot="append" :class="classes.spanColor">{{curPasswordLevel}}</span>
            </i-input>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="手机号" label-position="top" prop="phoneNum">
            <i-input v-model="formData.phoneNum" placeholder="目前只支持国人注册哦">
              <span slot="prepend">86</span>
            </i-input>
          </FormItem>
        </i-col>
      </Row>
      <FormItem label="自我介绍" label-position="top" prop="crewMessage">
        <i-input
          type="textarea"
          v-model="formData.crewMessage"
          :rows="4"
          placeholder="写下你的雄心壮志吧O(∩_∩)O"
        />
      </FormItem>
      <FormItem label="短信验证码" label-position="top" prop="verifyCode">
        <i-input v-model="formData.verifyCode" placeholder="防止恶意注册" style="width: 120px" />
        <Button style="margin-left: 10px" @click="getVerificationCode">获取验证码</Button>
      </FormItem>
      <FormItem label prop="tos">
        <RadioGroup v-model="formData.tos">
          <Radio label="tos" >
            我已经阅读过服务条款
            <a target="_blank" href="MyIona/tos">服务条款</a>
          </Radio>
        </RadioGroup>
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
  name: "LoginRegister",
  props: {
    crewNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      }
    },
    mailRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "邮箱不能为空", trigger: "blur" }];
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
    crewMessageRules: {
      type: Array,
      default: () => {
        return [{ max: 200, message: "你的雄心壮志太多了", trigger: "change" }];
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
    },
    tosRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "请查阅服务条款", trigger: "change" }
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
        spanColor: ""
      },
      formData: {
        crewName: "",
        mail: "",
        phoneNum: "",
        password: "",
        crewMessage: "",
        verifyCode: "",
        tos: ""
      },
      mailSuffixs: []
    };
  },
  computed: {
    rules() {
      return {
        crewName: this.crewNameRules,
        password: this.passwordRules,
        mail: this.mailRules,
        phoneNum: this.phoneRules,
        crewMessage: this.crewMessageRules,
        verifyCode: this.verifyCodeRules,
        tos: this.tosRules
      };
    }
  },
  methods: {
    submit: function() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            crewName: this.formData.crewName,
            mail: this.formData.mail,
            phoneNum: this.formData.phoneNum,
            passwordMd5: md5(this.formData.password),
            crewMessage: this.formData.crewMessage
          });
        }
      });
    },
    getVerificationCode: function() {
      let phoneNum = this.formData.phoneNum;
      post(
        global.$prop.URL.getVerificationCode,
        { phoneNum: phoneNum },
        this.verificationResponse
      );
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

