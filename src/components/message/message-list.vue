<style scoped>
.postButton {
  width: 10%;
  border-radius: 20px;
  margin-right: 20px;
}
.iMessageCard {
  margin-bottom: 10px;
  cursor: pointer;
}

.iMessage {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 17px;
  overflow-wrap: break-word;
  margin-top: 5px;
  white-space: pre-wrap;
}
.toolGroup {
  margin-top: 10px;
}

.toolButton span {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 15px;
  position: relative;
  bottom: 2px;
}

.toolIcon {
  font-size: 20px;
  margin-right: 5px;
  transition: font-size 0.5s;
  -moz-transition: font-size 0.5s; /* Firefox 4 */
  -webkit-transition: font-size 0.5s; /* Safari 和 Chrome */
  -o-transition: font-size 0.5s;
}

.toolIcon:hover {
  color: #57a3f3;
  font-size: 25px;
}

.toolSpan {
  margin-right: 30px;
}

.crewName-little {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 17px;
  overflow-wrap: break-word;
  color: black;
}
.creatorNameSpan:hover {
  text-decoration: underline;
}
</style>
<template>
  <div>
    <div v-if="showPostBar" style="margin-bottom: 10px">
      <Button class="postButton" type="primary" @click="handlePost">发文</Button>
      <Button class="postButton" type="primary" @click="handleReload">刷新</Button>
    </div>

    <Card class="iMessageCard" style="width:100%;" v-for="item in messageItems" :key="item.id">
      <div @click="jumpToMessageDetail(item.retweetorId > 0 ? item.retweetMessageId : item.id)">
        <Row>
          <p v-if="item.retweetorId > 0" style="color: rgb(155, 160, 165);">
            <Icon type="ios-repeat" />
            {{item.retweetorName}}转推了
          </p>
          <i-col span="2">
            <img
              class="iMessageAvatar"
              v-bind:src="item.avatarUrl"
              @click.stop="jumpToUserCard(item.creator)"
            />
          </i-col>
          <i-col span="21" style="margin-left: 10px">
            <p class="crewName-little">
              <span
                class="creatorNameSpan"
                @click.stop="jumpToUserCard(item.creator)"
              >{{item.creatorName}}</span>
              ·
              <span
                style="color: rgb(101, 119, 134);font-size: 15px;"
              >{{item.createTime.substring(0,4)}}.{{item.createTime.substring(4,6)}}.{{item.createTime.substring(6,8)}} {{item.createTime.substring(8,10)}}:{{item.createTime.substring(10,12)}}</span>
              <span style="float: right">
                <Icon :size="18" type="md-arrow-dropdown"></Icon>
              </span>
            </p>
            <p class="iMessage" v-html="item.html"></p>
            <div class="toolGroup">
              <Icon class="toolIcon" type="ios-chatbubbles-outline"></Icon>
              <span class="toolSpan">{{item.commentNums}}</span>
              <Icon
                class="toolIcon"
                :type="item.retweetIconType"
                @click.stop="lock && doRetweetSwitch(item)"
              ></Icon>
              <span class="toolSpan">{{item.retweetNums}}</span>
              <Icon class="toolIcon" :type="item.iconType" @click.stop="lock && doLikeSwitch(item)"></Icon>
              <span class="toolSpan">{{item.likeNums}}</span>
            </div>
          </i-col>
        </Row>
      </div>
    </Card>

    <new-message ref="newMessage" @on-success-valid="handleNewMessage"></new-message>
  </div>
</template>
<script>
import NewMessage from "../../components/message/new-i-message";
import { post, getCookie } from "@/util/httpUtil.js";

export default {
  components: { NewMessage },
  props: {
    messageItems: {
      type: Array
    },
    showPostBar: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      iconNoLike: "ios-heart-outline",
      iconLike: "ios-heart",
      iconNoRetweet: "ios-repeat",
      iconRetweet: "md-repeat",
      lock: true, //控制按钮点击的锁,防止高频率多次点击
      bottomHight: 50 //滚动条到某个位置才触发时间
    };
  },
  computed: {
    avatarSrc: function() {
      return this.$store.state.avatarUrl;
    }
  },
  created: function() {},
  methods: {
    handlePost() {
      this.openNewMessagePannel();
    },
    handleReload() {
      this.$emit("on-reload-request");
    },
    openNewMessagePannel() {
      this.$refs.newMessage.show = true;
    },
    closeNewMessagePannel() {
      this.$refs.newMessage.show = false;
    },
    handleNewMessage(data) {
      post(global.$prop.URL.newMessage, data, this.newMessageResponse);
    },
    newMessageResponse(responseData) {
      global.$util.successNotice("发文成功");
      this.closeNewMessagePannel();
      this.$emit("new-message-success");
    },
    jumpToUserCard(id) {
      global.$util.routerPushRestful({
        name: "userCard",
        params: { userId: id }
      });
    },
    doLikeSwitch(item) {
      let self = this;
      //锁门
      self.lock = false;
      //喜欢
      if (item.iconType == this.iconNoLike) {
        post(
          global.$prop.URL.doLike,
          {
            likerId: self.$store.state.userData.id,
            messageId: item.retweetorId > 0 ? item.retweetMessageId : item.id,
            messageCreator: item.creator,
            curItem: item
          },
          this.doLikeResponse
        );
      }
      //取消喜欢
      else if (item.iconType == this.iconLike) {
        post(
          global.$prop.URL.cancelLike,
          {
            likerId: self.$store.state.userData.id,
            messageId: item.retweetorId > 0 ? item.retweetMessageId : item.id,
            messageCreator: item.creator,
            curItem: item
          },
          this.cancelLikeResponse
        );
      }
    },
    doLikeResponse(responseData, data) {
      data.curItem.iconType = this.iconLike;
      data.curItem.likeNums = String(Number(data.curItem.likeNums) + 1);
      this.lock = true; //解锁
      this.handleReload(); //取消转推手动触发刷新，提高下体验
    },
    cancelLikeResponse(responseData, data) {
      data.curItem.iconType = this.iconNoLike;
      data.curItem.likeNums = String(Number(data.curItem.likeNums) - 1);
      if (data.curItem.likeNums == "0") {
        data.curItem.likeNums = "";
      }
      this.lock = true; //解锁
      this.handleReload(); //取消转推手动触发刷新，提高下体验
    },
    doRetweetSwitch(item) {
      let self = this;
      //锁门
      self.lock = false;
      //转推
      if (item.retweetIconType == this.iconNoRetweet) {
        post(
          global.$prop.URL.newReTweetMessage,
          {
            id: item.retweetorId > 0 ? item.retweetMessageId : item.id,
            html: item.html,
            createTime: item.createTime,
            creator: item.creator,
            curUserId: self.$store.state.userData.id,
            curItem: item
          },
          this.newReTweetMessageResponse
        );
      }
      //取消转推
      else if (item.retweetIconType == this.iconRetweet) {
        post(
          global.$prop.URL.cancelReTweetMessage,
          {
            curUserId: self.$store.state.userData.id,
            retweetMessageId:
              item.retweetMessageId == 0 ? item.id : item.retweetMessageId,
            curItem: item
          },
          this.cancelReTweetMessageResponse
        );
      }
    },
    newReTweetMessageResponse(responseData, data) {
      data.curItem.retweetIconType = this.iconRetweet;
      data.curItem.retweetNums = String(Number(data.curItem.retweetNums) + 1);
      this.lock = true; //解锁
      this.handleReload(); //取消转推手动触发刷新，提高下体验
    },
    cancelReTweetMessageResponse(responseData, data) {
      data.curItem.retweetIconType = this.iconNoRetweet;
      data.curItem.retweetNums = String(Number(data.curItem.retweetNums) - 1);
      if (data.curItem.retweetNums == "0") {
        data.curItem.retweetNums = "";
      }
      this.lock = true; //解锁
      this.handleReload(); //取消转推手动触发刷新，提高下体验
    },
    jumpToMessageDetail(messageId) {
      global.$util.routerPushRestful({
        name: "messageDetail",
        params: { messageId: messageId }
      });
    },
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i);
          }
          resolve();
        }, 2000);
      });
    }
  }
};
</script>