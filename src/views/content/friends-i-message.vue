<style scoped>
</style>
<template>
  <Content class="IonaContent">
    <Row>
      <i-col span="15">
        <message-list
          v-if="!loading"
          :showPostBar="true"
          @new-message-success="handleReload"
          @on-reload-request="handleReload"
          :messageItems="friendMessageItems"
        ></message-list>
      </i-col>
      <i-col span="8" style="margin-left: 20px">
        <recommend-user></recommend-user>
      </i-col>
    </Row>
    <Spin fix v-if="loading"></Spin>
  </Content>
</template>
<script>
import MessageList from "../../components/message/message-list";
import RecommendUser from "../../components/right-list/recommend-user";
import { post, getCookie } from "@/util/httpUtil.js";
import { EventBus } from "@/util/EventBus.js";

export default {
  components: { MessageList, RecommendUser },
  data() {
    return {
      loading: false,
      switchs: false,
      friendMessageItems: [],
      pager: {
        index: 1,
        size: 10
      }
    };
  },
  created: function() {
    //拉取个人伊文
    this.initFriendIMessage();
    EventBus.$on("on-scroll-buttom", () => {
      this.handleScrollButtom();
    });
  },
  methods: {
    handleScrollButtom() {
      this.pager.index += 1;
      let self = this;
      post(
        global.$prop.URL.getFriendMessage,
        {
          message: {
            id: this.$store.state.userData.id
          },
          pager: self.pager
        },
        this.handleScrollButtomResponse
      );
    },
    handleScrollButtomResponse(responseData) {
      if (responseData.messages.length > 0) {
        this.friendMessageItems = this.friendMessageItems.concat(
          responseData.messages
        );
        EventBus.$emit("on-scroll-buttom-success");
      } else {
        global.$util.logger("已无更多数据");
      }
    },
    initFriendIMessage() {
      //重置pager
      this.pager.index = 1;
      let self = this;
      post(
        global.$prop.URL.getFriendMessage,
        {
          message: {
            id: this.$store.state.userData.id
          },
          pager: self.pager
        },
        this.initFriendIMessageResponse
      );
    },
    initFriendIMessageResponse(responseData) {
      this.friendMessageItems = responseData.messages;
      this.loading = false;
    },
    handleReload() {
      this.initFriendIMessage();
    }
  }
};
</script>