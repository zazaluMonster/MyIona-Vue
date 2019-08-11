<style scoped>
.icon {
  font-size: 16px;
  position: relative;
  bottom: 1px;
  margin-right: 4px;
}
</style>

<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="haveNewNotice">
        <Avatar :src="avatarSrc" />
      </Badge>

      <Icon :size="18" type="md-arrow-dropdown"></Icon>

      <!-- dropDownItem的name对应的就是click的触发方法 -->
      <DropdownMenu slot="list">
        <DropdownItem name="openNoticePannel">
          <Icon class="icon" type="md-chatboxes" />消息中心
          <Badge style="margin-left: 10px" :count="newNoticeNums"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">
          <Icon class="icon" type="ios-log-out" />退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!-- Websocket消息接收器 -->
    <ws-message-receiver @on-new-notice="handleNewNotice"></ws-message-receiver>
    <!-- 通知页面 -->
    <notice-list ref="noticeList" :noticeItems="noticesItem" @on-reload-request="handleNewNotice"></notice-list>
  </div>
</template>

<script>
import "./user.less";
import { PROP } from "@/properties.js";
import WsMessageReceiver from "../header/ws-message-receiver"
import NoticeList from "../notice/notice-list"
import { post } from "@/util/httpUtil.js";
import {delCookie} from "@/util/httpUtil.js";

export default {
  name: "User",
  components: {WsMessageReceiver,NoticeList},
  props: {},
  data() {
    return {
      haveNewNotice: false,
      newNoticeNums: 0,
      noticesItem: []
    };
  },
  computed: {
    avatarSrc: function() {
      return this.$store.state.avatarUrl;
    }
  },
  created: function(){
    this.getCurUserNotice(this.$store.state.userData.id);
  },
  methods: {
    getCurUserNotice(crewId){
      post(
        global.$prop.URL.getNewNotice,
        { notifierId: crewId },
        this.getCurUserNoticeResponse
      );
    },
    getCurUserNoticeResponse(responseData){
      this.newNoticeNums = responseData.notices.length;
      if(this.newNoticeNums > 0){
        this.haveNewNotice = true;
      }else{
        this.haveNewNotice = false;
      }
      this.noticesItem = responseData.notices;
    },
    logout() {
      //删除cookie
      delCookie(this.$store.state.userData.crewName + global.$prop.COOKIE_SUFFIX);
      delCookie(global.$prop.COOKIE_USERNAME);
      //清除vuex的userData
      this.$store.commit("emptyUserData", {});
      //router回登录页
      this.$router.push({
        name: "login"
      });
      
    },
    handleClick(name) {
      switch (name) {
        case "openNoticePannel":
          this.openNoticePannel();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    handleNewNotice(){
      this.getCurUserNotice(this.$store.state.userData.id);
    },
    openNoticePannel(){
      this.$refs.noticeList.show = true;
    }
  }
};
</script>
