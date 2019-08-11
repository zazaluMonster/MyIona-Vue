<style scoped>
.content {
  padding-left: 5px;
}

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
        </div>
      </i-col>
      <i-col span="18">
        <message-list
          :showPostBar="true"
          :messageItems="myMessageItems"
          @new-message-success="newMessageSuccess"
          @on-reload-request="handReload"
        ></message-list>
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
      myMessageItems: []
    };
  },
  computed: {
    userData() {
      return this.$store.state.userData;
    },
    avatarSrc: function() {
      return this.$store.state.avatarUrl;
    }
  },
  created: function() {
    //拉取个人伊文
    this.initMyIMessage();
  },
  methods: {
    initMyIMessage() {
      post(
        global.$prop.URL.getMyMessage,
        {
          curUserId: this.$store.state.userData.id
        },
        this.initMyIMessageResponse
      );
    },
    initMyIMessageResponse(responseData) {
      this.myMessageItems = responseData.messages;
      this.loading = false;
    },
    newMessageSuccess() {
      this.initMyIMessage();
    },
    handReload() {
      this.initMyIMessage();
    }
  }
};
</script>