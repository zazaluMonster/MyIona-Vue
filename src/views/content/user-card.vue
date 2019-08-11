<style scoped>
.avatarCover {
  height: auto;
  width: fit-content;
}
img {
  width: 180px;
  height: 180px;
}
.crewName {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 20px;
  overflow-wrap: break-word;
  color: black;
  text-align: center;
}
.crewOther {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 15px;
  overflow-wrap: break-word;
  color: black;
  text-align: center;
}
.followButton {
  display: block;
  margin: 0 auto;
  margin-top: 7%;
}
</style>
<template>
  <Content class="IonaContent">
    <Row>
      <i-col span="6">
        <div style="width: fit-content">
          <div class="avatarCover">
            <img :src="avatarSrc" />
          </div>
          <div>
            <div>
              <p class="crewName">{{userData.crewName}}</p>
              <p class="crewOther">
                <Icon type="ios-mail-outline" />
                <a>{{userData.mail}}</a>
              </p>
              <p class="crewOther">
                <Icon type="ios-phone-portrait" />
                {{userData.phoneNum}}
              </p>
            </div>
          </div>
          <div>
            <Button
              v-if="!showFollow"
              class="followButton"
              icon="ios-heart-outline"
              type="info"
              ghost
              :disabled="buttonController"
              @click="handleFollowStatus"
            >关注</Button>
            <Button
              v-if="showFollow"
              class="followButton"
              icon="ios-heart-outline"
              type="info"
              :disabled="buttonController"
              @click="handleFollowStatus"
            >取消关注</Button>
          </div>
        </div>
      </i-col>
      <i-col span="18">
        <message-list :showPostBar="false" :messageItems="userMessageItems"></message-list>
      </i-col>
    </Row>
    <Spin fix v-if="loading" style="z-index:1000"></Spin>
  </Content>
</template>
<script>
import { post, getCookie } from "@/util/httpUtil.js";
import sleep from "sleepjs";
import MessageList from "../../components/message/message-list";

export default {
  components: { MessageList },
  data() {
    return {
      loading: true,
      userMessageItems: [],
      userData: {},
      avatarSrc: "",
      showFollow: false, //true表示已关注，false表示没有关注
      loginUserData: {},
      buttonController: false
    };
  },
  created: function() {
    //拉取当前用户信息
    this.initUserData(this.$route.params.userId);
    this.initUserIMessage(this.$route.params.userId);
    this.initFollowStatus(this.$route.params.userId);
  },
  methods: {
    initUserData(userId) {
      post(
        global.$prop.URL.getCrew,
        {
          id: userId
        },
        this.initUserDataResponse
      );
    },
    initUserDataResponse(responseData) {
      this.userData = responseData.crew;
      this.avatarSrc = global.$util.getAvatarUrl(this.userData.avatarUrl);
    },
    initUserIMessage(userId) {
      if (userId == this.$store.state.userData.id) {
        global.$util.routerPush("我的伊文")
      } else {
        post(
          global.$prop.URL.getUserMessage,
          {
            creator: userId,
            curUserId: this.$store.state.userData.id
          },
          this.initMyIMessageResponse
        );
      }
    },
    initMyIMessageResponse(responseData) {
      this.userMessageItems = responseData.messages;
      this.loading = false;
    },
    initFollowStatus(userId) {
      this.loginUserData = this.$store.state.userData;
      let loginUserId = this.loginUserData.id;
      post(
        global.$prop.URL.isFollowing,
        {
          followerId: loginUserId,
          followingId: userId
        },
        this.initFollowStatusResponse
      );
    },
    initFollowStatusResponse(responseData) {
      if (responseData.follow == null) {
        this.showFollow = false;
      } else {
        this.showFollow = true;
      }
    },
    handleFollowStatus() {
      if (this.showFollow) {
        this.cancelFollow();
      } else {
        this.addFollow();
      }
    },
    cancelFollow() {
      this.showFollow = false;
      this.controlFollowButtonClick(true);
      let loginUserId = this.loginUserData.id;
      let userId = this.$route.params.userId;
      post(
        global.$prop.URL.cancelFollow,
        {
          followerId: loginUserId,
          followingId: userId
        },
        this.cancelFollowResponse
      );
    },
    cancelFollowResponse() {
      this.controlFollowButtonClick(false);
      global.$util.logger("取消关注成功");
    },
    addFollow() {
      this.showFollow = true;
      this.controlFollowButtonClick(true);
      let loginUserId = this.loginUserData.id;
      let userId = this.$route.params.userId;
      post(
        global.$prop.URL.addFollow,
        {
          followerId: loginUserId,
          followingId: userId
        },
        this.addFollowResponse
      );
    },
    addFollowResponse() {
      this.controlFollowButtonClick(false);
      global.$util.logger("添加关注成功");
    },
    controlFollowButtonClick(flag) {
      this.buttonController = flag;
    }
  }
};
</script>