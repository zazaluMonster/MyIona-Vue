<style scoped>
.avatar {
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 9999px;
  border-bottom-right-radius: 9999px;
  border-top-left-radius: 9999px;
  border-top-right-radius: 9999px;
}
.user-introduce {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 12px;
  overflow-wrap: break-word;
  margin-top: 5px;
  white-space: pre-wrap;
  color: black;
  margin-bottom: 20px;
}
.crewName {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 8px;
  color: black;
  width: 100%;
  /* 省略显示 */
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -icab-text-overflow: ellipsis;
  -khtml-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
}
.followButton {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-bottom-left-radius: 9999px;
  border-bottom-right-radius: 9999px;
  border-top-left-radius: 9999px;
  border-top-right-radius: 9999px;
  width: 90%;
}
ul li {
  margin-bottom: 10px;
  border-bottom-color: rgb(230, 236, 240);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
</style>
<template>
  <Card style="width:400px">
    <p slot="title">推荐用户</p>
    <ul>
      <li v-for="item in dataItems" :key="item.id">
        <Row>
          <i-col span="2">
            <img class="avatar" :src="getAvatarUrl(item.avatarUrl)" />
          </i-col>
          <i-col span="21" style="margin-left: 10px">
            <Row>
              <i-col span="17">
                <p class="crewName">
                  <strong>{{item.crewName}}</strong>
                </p>
              </i-col>
              <i-col span="7">
                <Button
                  v-if="item.isFollow == 0"
                  class="followButton"
                  icon="ios-heart-outline"
                  type="info"
                  :disabled="buttonController"
                  @click="handleFollowStatus(item)"
                  ghost
                >关注</Button>
                <Button
                  v-if="item.isFollow > 0"
                  class="followButton"
                  icon="ios-heart-outline"
                  type="info"
                  :disabled="buttonController"
                  @click="handleFollowStatus(item)"
                >取消关注</Button>
              </i-col>
            </Row>
            <Row>
              <p class="user-introduce">{{item.crewMessage}}</p>
            </Row>
          </i-col>
        </Row>
      </li>
      <div>
        <a @click="changeData">换一批</a>
      </div>
    </ul>
  </Card>
</template>
<script>
import { post, getCookie } from "@/util/httpUtil.js";

export default {
  components: {},
  props: {
    // 根据此User去计算推荐用户
    associatedUserId: {
      type: Number,
      default: function() {
        return this.$store.state.userData.id;
      }
    }
  },
  data() {
    return {
      pagerIndex: 1,
      pagerSize: 3,
      dataItems: null,
      buttonController: false
    };
  },
  created: function() {
    this.initData();
  },
  methods: {
    initData() {
      post(
        global.$prop.URL.getRecommendUser,
        {
          associatedUserId: this.associatedUserId,
          curUserId: this.$store.state.userData.id,
          pagerIndex: this.pagerIndex,
          pagerSize: this.pagerSize
        },
        this.initDataResponse
      );
    },
    initDataResponse(responseData) {
      this.dataItems = responseData.crewList;
      this.pagerIndex += 1;

      //若发现换一批换到底了，重新第一页开始
      if(this.dataItems.length == 0){
        this.pagerIndex = 1
        this.initData();
      }
    },
    changeData() {
      this.initData();
    },
    getAvatarUrl(avatar) {
      let url;
      let avatar_str = String(avatar);
      if (avatar_str.trim().length == 0) {
        url = this.$store.state.defaultAvatarUrl;
      } else {
        url = global.$util.getAvatarUrl(avatar_str);
      }
      return url;
    },
    handleFollowStatus(item) {
      if (item.isFollow == 0) {
        this.addFollow(item);
      } else {
        this.cancelFollow(item);
      }
    },
    cancelFollow(item) {
      item.isFollow = 0;
      this.buttonController = true;
      post(
        global.$prop.URL.cancelFollow,
        {
          followerId: this.$store.state.userData.id,
          followingId: item.id
        },
        this.cancelFollowResponse
      );
    },
    cancelFollowResponse() {
      this.buttonController = false;
    },
    addFollow(item) {
      item.isFollow = 1;
      this.buttonController = true;
      post(
        global.$prop.URL.addFollow,
        {
          followerId: this.$store.state.userData.id,
          followingId: item.id
        },
        this.addFollowResponse
      );
    },
    addFollowResponse() {
      this.buttonController = false;
    }
  }
};
</script>