<style scoped>
.turnBackWrap {
  font-size: 30px;
  min-width: fit-content;
  min-height: fit-content;
  width: 40px;
  text-align: center;
  height: 40px;
  line-height: initial;
  color: rgba(29, 161, 242, 1);
  border-radius: 9999px;
  cursor: pointer;
}
.turnBackWrap:hover {
  background-color: rgba(163, 223, 246, 0.34);
}

.headerTitle {
  height: 40px;
  font-size: 25px;
  color: black;
  cursor: pointer;
}

.border {
  border-bottom-color: rgb(230, 236, 240);
  border-bottom-style: solid;
  border-bottom-width: 1px;
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

.content-header {
  height: 70px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.content-header-userdata {
  height: 100%;
  display: table;
  margin-left: 10px;
}
.content-wrap {
  display: table-cell;
  vertical-align: middle;
}
.content-middle {
  font-size: 23px;
  color: black;
  margin-top: 10px;
  margin-bottom: 10px;
}
.content-middle-footer {
  height: 50px;
  line-height: 50px;
  font-size: 13px;
}
.tool-icon-wrap {
  text-align: center;
  font-size: 20px;
  color: black;
}

.toolIcon {
  transition: font-size 0.5s;
  -moz-transition: font-size 0.5s; /* Firefox 4 */
  -webkit-transition: font-size 0.5s; /* Safari 和 Chrome */
  -o-transition: font-size 0.5s;
  cursor: pointer;
}

.toolIcon:hover {
  color: #57a3f3;
  font-size: 25px;
}

.iMessage {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 17px;
  overflow-wrap: break-word;
  margin-top: 5px;
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.comment-wrap {
  margin-top: 10px;
}
</style>
<template>
  <Content class="IonaContent">
    <Row>
      <i-col span="15">
        <Row class="border">
          <i-col span="2">
            <div class="turnBackWrap" @click="goBack">
              <Icon type="md-arrow-back" />
            </div>
          </i-col>
          <i-col span="19">
            <div class="headerTitle">推文详情</div>
          </i-col>
        </Row>
        <Row class="content-header border">
          <i-col span="2">
            <img class="iMessageAvatar" :src="messageDetail.avatarUrl" />
          </i-col>
          <i-col span="21" class="content-header-userdata">
            <div class="content-wrap">
              <p class="crewName-little">
                <span class="creatorNameSpan">{{messageDetail.creatorName}}</span>
                ·
                <span
                  style="color: rgb(101, 119, 134);font-size: 15px;"
                >{{messageDetail.createTime.substring(0,4)}}.{{messageDetail.createTime.substring(4,6)}}.{{messageDetail.createTime.substring(6,8)}} {{messageDetail.createTime.substring(8,10)}}:{{messageDetail.createTime.substring(10,12)}}</span>
                <span style="float: right">
                  <Icon :size="18" type="md-arrow-dropdown"></Icon>
                </span>
              </p>
              <p>@{{messageDetail.mail}}</p>
            </div>
          </i-col>
        </Row>
        <Row class="content-middle border">
          <p class="iMessage" v-html="messageDetail.html"></p>
        </Row>
        <Row class="content-middle-footer border">
          <i-col span="3">
            <strong style="color:black">{{messageDetail.retweetNums == "" ? 0 : messageDetail.retweetNums}}</strong> 转推
          </i-col>
          <i-col span="19">
            <strong style="color:black">{{messageDetail.likeNums == "" ? 0 : messageDetail.likeNums}}</strong> 喜欢
          </i-col>
        </Row>
        <Row class="content-middle-footer border">
          <i-col class="tool-icon-wrap" span="6">
            <Icon class="toolIcon" type="ios-chatbubbles-outline" @click="handleReply"/>
          </i-col>
          <i-col class="tool-icon-wrap" span="6">
            <Icon v-if="messageDetail.likeRecordId <= 0" class="toolIcon" type="ios-heart-outline" />
            <Icon v-if="messageDetail.likeRecordId > 0" class="toolIcon" type="ios-heart" />
          </i-col>
          <i-col class="tool-icon-wrap" span="6">
            <Icon v-if="messageDetail.doCurUserRetweet <= 0" class="toolIcon" type="ios-repeat" />
            <Icon v-if="messageDetail.doCurUserRetweet > 0" class="toolIcon" type="md-repeat" />
          </i-col>
          <i-col class="tool-icon-wrap" span="6">
            <Icon class="toolIcon" type="ios-redo-outline" />
          </i-col>
        </Row>
        <!-- 评论 -->
        <Row class="comment-wrap border" v-for="item in replyItem" :key="item.id">
          <i-col span="2">
            <img class="iMessageAvatar" :src="item.avatarUrl" />
          </i-col>
          <i-col span="21" style="margin-left: 10px;margin-bottom: 10px">
            <p class="crewName-little">
              <span class="creatorNameSpan">{{item.crewName}}</span>
              ·
              <span
                style="color: rgb(101, 119, 134);font-size: 15px;"
              >{{item.createTime.substring(0,4)}}.{{item.createTime.substring(4,6)}}.{{item.createTime.substring(6,8)}} {{item.createTime.substring(8,10)}}:{{item.createTime.substring(10,12)}}</span>
              <span style="float: right">
                <Icon :size="18" type="md-arrow-dropdown"></Icon>
              </span>
            </p>
            <p class="iMessage" v-html="item.html"></p>
          </i-col>
        </Row>
      </i-col>
      <i-col span="8" style="margin-left: 20px">
        <recommend-user></recommend-user>
      </i-col>
    </Row>
    <message-reply ref="messageReply" :curMessageItems="messageDetail" @on-reply-success="reloadReply"></message-reply>
  </Content>
</template>
<script>
import RecommendUser from "../../components/right-list/recommend-user";
import MessageReply from "../../components/message/message-reply";
import { post, getCookie } from "@/util/httpUtil.js";

export default {
  components: { RecommendUser,MessageReply },
  data() {
    return {
      show: false,
      messageDetail: {
         createTime: "300011111111"
      },
      replyItem: []
    };
  },
  mounted: function() {
    //初始化当前推特的数据
    this.initMessageData(this.$route.params.messageId);
    this.initMessageReply(this.$route.params.messageId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    initMessageData(messageId) {
      post(
        global.$prop.URL.messageDetail,
        {
          id: messageId,
          curUserId: this.$store.state.userData.id
        },
        this.initMessageDataResponse
      );
    },
    initMessageDataResponse(responseData) {
      this.messageDetail = responseData.messageDetail;
    },
    initMessageReply(messageId){
      post(
        global.$prop.URL.commentList,
        {
          messageId: messageId,
        },
        this.initMessageReplyResponse
      );
    },
    initMessageReplyResponse(responseData) {
      this.replyItem = responseData.comments;
    },
    handleReply() {
      this.$refs.messageReply.show = true;
    },
    reloadReply() {
      this.initMessageReply(this.$route.params.messageId);
    }
  }
};
</script>