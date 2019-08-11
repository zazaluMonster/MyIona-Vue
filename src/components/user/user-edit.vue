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
    title="请修改您的个人资料：）"
    v-model="show"
    width="720"
    :mask-closable="false"
    :styles="styles"
    placement="right"
  >
    <Form ref="updateForm" :model="formData" :rules="rules">
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="昵称" label-position="top" prop="crewName">
            <i-input v-model="formData.crewName" placeholder="昵称" />
          </FormItem>
        </i-col>
      </Row>
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="手机号" label-position="top" prop="phoneNum">
            <i-input v-model="formData.phoneNum" placeholder="手机号">
              <span slot="prepend">86</span>
            </i-input>
          </FormItem>
        </i-col>
      </Row>
      <Row :gutter="32">
        <i-col span="12">
          <FormItem label="邮箱" label-position="top" prop="mail">
            <!-- <i-input v-model="formData.mail" placeholder="邮箱"></i-input> -->
            <AutoComplete v-model="formData.mail" @on-search="handleMailSuffix" placeholder="邮箱">
              <Option v-for="item in mailSuffixs" :value="item" :key="item">{{ item }}</Option>
            </AutoComplete>
          </FormItem>
        </i-col>
      </Row>
      <FormItem label="自我介绍" label-position="top" prop="crewMessage">
        <i-input type="textarea" v-model="formData.crewMessage" :rows="4" placeholder="自我介绍" />
      </FormItem>
      <FormItem label="短信验证码" label-position="top" prop="verifyCode">
        <i-input v-model="formData.verifyCode" placeholder="防止恶意修改" style="width: 120px" />
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
  name: "userDataEdit",
  props: {
    crewNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
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
      formData: {
        crewName: "",
        mail: "",
        phoneNum: "",
        crewMessage: "",
        verifyCode: ""
      },
      mailSuffixs: []
    };
  },
  computed: {
    rules() {
      return {
        crewName: this.crewNameRules,
        mail: this.mailRules,
        phoneNum: this.phoneRules,
        crewMessage: this.crewMessageRules,
        verifyCode: this.verifyCodeRules
      };
    }
  },
  created() {
    this.boot();
  },
  methods: {
    boot() {
      let userData = this.$store.state.userData;
      this.formData = {
        crewName: userData.crewName,
        mail: userData.mail,
        phoneNum: userData.phoneNum,
        crewMessage: userData.crewMessage,
        verifyCode: ""
      };
    },
    submit: function() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            id: this.$store.state.userData.id,
            crewName: this.formData.crewName,
            mail: this.formData.mail,
            phoneNum: this.formData.phoneNum,
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

