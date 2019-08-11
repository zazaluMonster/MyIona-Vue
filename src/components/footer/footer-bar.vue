<style scoped>
/* footer */
.ivu-row h4 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 400;
}
.layout-footer-center {
  background: black;
  color: aliceblue;
  padding-left: 81px;
}
.ivu-row h4 i {
  font-size: 20px;
  color: #9ea7b4;
  position: relative;
  top: -2px;
  margin-right: 2px;
}

li {
  list-style-type: none;
  margin-bottom: 5px;
  padding-left: 8px;
}

.footer-social-icon {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.footer-qr {
  width: 164px;
}

a {
  background: 0 0;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}
.footer a {
  color: #fff;
  font-size: 14px;
}
.footer a:hover {
  color: #2d8cf0;
}
.footer-li-have-font {
  color: #666;
  padding-bottom: 5px;
}
.footer-logo {
  height: 45px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.footer-aside {
  text-align: center;
}
.footer-logo img {
  height: 100%;
}
</style>
<template>
  <Footer class="layout-footer-center footer">
        <Row :gutter="16">
          <i-col span="5">
            <h4>
              <i class="ivu-icon ivu-icon-logo-github"></i>
              GitHub
            </h4>
            <ul>
              <li>
                <a href="https://github.com/zazaluMonster/MySpider" target="_blank">MySpider</a>
              </li>
              <li>
                <a href="https://github.com/zazaluMonster/MyBelfast" target="_blank">MyIona</a>
              </li>
              <li>
                <a href="https://github.com/zazaluMonster/MyIona" target="_blank">MyBelfast</a>
              </li>
            </ul>
          </i-col>
          <i-col span="6">
            <h4>
              <i class="ivu-icon ivu-icon-ios-link"></i>
              联系方式
            </h4>
            <ul>
              <li class="footer-li-have-font">
                - 邮箱 -
                <a target="_blank">hejiajun1432@gmail.com</a>
              </li>
              <li>
                <Row>
                  <i-col span="5">
                    <Poptip trigger="hover" >
                      <a>
                        <img src="../../assets/images/svg/weixin.svg" class="footer-social-icon" />
                      </a>

                      <div slot="content">
                        <img class="footer-qr" src="../../assets/images/contact/weixin.png" />
                      </div>
                    </Poptip>
                  </i-col>
                  <i-col span="5">
                    <Poptip trigger="hover" >
                      <a>
                        <img src="../../assets/images/svg/qq.svg" class="footer-social-icon" />
                      </a>

                      <div slot="content">
                        <img class="footer-qr" src="../../assets/images/contact/qq.jpg" />
                      </div>
                    </Poptip>
                  </i-col>
                  <i-col span="5">
                    <Tooltip content="知乎" placement="top">
                      <a>
                        <img src="../../assets/images/svg/zhifu.svg" class="footer-social-icon" />
                      </a>
                    </Tooltip>
                  </i-col>
                </Row>
              </li>
            </ul>
          </i-col>
          <i-col span="6">
            <h4>
              <i class="ivu-icon ivu-icon-ios-chatbubbles"></i>
              其他
            </h4>
            <ul>
              <li class="footer-li-have-font">
                - 博客 -
                <a href="https://zazalu.space/" target="_blank">zazalu's blog</a>
              </li>
              <li class="footer-li-have-font">
                - 在线讨论 -
                <a target="_blank" @click="openChatRoom">进入</a>
              </li>
            </ul>
          </i-col>
          <i-col span="5">
            <div class="footer-aside">
              <div class="footer-logo">
                <img src="../../assets/logo/logo.png" />
              </div>
              <ul>
                <li>© 2019 zazalu版权所有</li>
              </ul>
            </div>
          </i-col>
        </Row>
        <div>
          <chat-room ref="chatRoom"></chat-room>
        </div>
      </Footer>
</template>
<script>
import ChatRoom from "../chat-room/chat-room"

export default {
  components:{
    ChatRoom
  },
  data() {
    return {
      value3: "",
      data3: ["船员管理", "修改密码", "上传头像"],
      searchCompont: "search",
      searchSwitch: false,
      headerMenus: [
        {
          title: "生态",
          icon: "ios-keypad"
        },
        {
          title: "组件",
          icon: "ios-analytics"
        },
        {
          title: "教程",
          icon: "ios-paper"
        }
      ]
    };
  },
  methods: {
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    headerMenuRouter(name) {
      global.$util.logger(name);
      //开启搜索组件
      if (name == this.searchCompont) {
        this.searchSwitch = true;
      }
      //其他菜单Router
      else {
        this.searchSwitch = false;
      }
    },
    openChatRoom(){
      this.$refs.chatRoom.show = true;
    }
  }
};
</script>

