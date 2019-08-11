<style scoped>
.chat-message-container {
  overflow-wrap: break-word;
  height: 300px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  border-right-color: rgb(230, 236, 240);
  border-right-style: solid;
  border-right-width: 4px;
}

.chat-message-container::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.chat-user-list-container {
  overflow-wrap: break-word;
  height: 300px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  padding-left: 10px;
}

.chat-user-list-container::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.userMeta {
  font-weight: bold;
  font-size: 15px;
  color: gray;
}

.user-online {
  font-weight: bold;
  font-size: 15px;
  color: gray;
}

.userMessage {
  font-size: 14px;
  line-height: 1.6;
  color: #000;
}

.user-item {
  font-size: 14px;
  line-height: 1.6;
  color: #000;
}
</style>
<template>
  <Modal
    v-model="show"
    draggable
    scrollable
    title="在线讨论"
    width="700"
    :customStyleForBody="modalBodyStyle"
    @on-visible-change="onModelVisibleChange"
  >
    <Row>
      <i-col span="18">
        <div ref="chatContainer" class="chat-message-container">
          <div class="chat-message" v-for="item in chatMessages" :key="item.name+random()">
            <p class="userMeta">{{item.name}}:</p>
            <p class="userMessage">{{item.message}}</p>
          </div>
        </div>
      </i-col>
      <i-col span="6">
        <div>
          <div class="chat-user-list-container">
            <div class="chat-user-list">
              <p class="user-online">在线人员:</p>
              <p class="user-item" v-for="item in userList" :key="item">{{item}}</p>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
    <div slot="footer">
      <p>{{debugTip}}</p>
      <Input
        v-model="messageBuffer"
        placeholder="Enter something..."
        style="width: 300px;float: left"
        @on-enter="sendMessage"
      />
      <Button type="success" @click="sendMessage">发送</Button>
      <Button type="info" @click="openConnect">连接</Button>
    </div>
  </Modal>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  components: {},
  data() {
    return {
      show: false,
      modalBodyStyle: {
        padding: "0px"
      },
      messageBuffer: "",
      debugTip: "",
      chatMessages: [],
      userList: []
    };
  },
  created: function() {
    window.onbeforeunload = (e) => {
      this.disconnect();
    };
  },
  beforeDestroy: function() {
    this.disconnect();
  },
  methods: {
    initWebSocket() {
      this.connection();
    },
    connection() {
      let url = global.$prop.DEBUG
        ? global.$prop.DEV_BASEURL + global.$prop.WEBSOCKETPATH
        : global.$prop.PROD_BASEURL + global.$prop.WEBSOCKETPATH;
      //建立连接对象
      this.socket = new SockJS(url);
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      var headers = {};
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          this.debugTip = "连接成功";
          //订阅广播消息
          this.stompClient.subscribe(
            global.$prop.WEBSOCKET_CHAT_ROOM_PRODUCE_PATH,
            msg => {
              let resData = global.$util.parseJson(msg.body);
              global.$util.logger(resData.chatMessage);
              if (resData.chatMessage != null) {
                this.chatMessages = this.chatMessages.concat(
                  resData.chatMessage
                );
              }
              this.messageBuffer = "";
              this.scrollToButtom();
              this.handleUserList(resData.userList);
            }
          );
          this.sendConnet();
        },
        err => {
          this.debugTip = "连接错误";
          // 连接发生错误时的处理函数
          global.$util.logger(err);
        }
      );
    },
    // 断开连接
    async disconnect() {
      if (this.stompClient != null) {
        await this.sendDisconnect();
        this.stompClient.disconnect();
        global.$util.logger("Disconnected");
      }
    },
    sendMessage() {
      let self = this;
      this.stompClient.send(
        global.$prop.WEBSOCKETPATHPERFIX +
          global.$prop.WEBSOCKET_CHAT_ROOM_SERVER_PATH,
        {},
        JSON.stringify({
          message: {
            name: self.$store.state.userData.crewName,
            message: self.messageBuffer
          }
        })
      );
    },
    sendDisconnect() {
      let self = this;
      this.stompClient.send(
        global.$prop.WEBSOCKETPATHPERFIX +
          global.$prop.WEBSOCKET_CHAT_ROOM_SERVER_PATH,
        {},
        JSON.stringify({
          name: self.$store.state.userData.crewName,
          type: global.$prop.CHAT_DISCONNET
        })
      );
      //清除数据
      this.dataInitialize();
    },
    sendConnet() {
      let self = this;
      this.stompClient.send(
        global.$prop.WEBSOCKETPATHPERFIX +
          global.$prop.WEBSOCKET_CHAT_ROOM_SERVER_PATH,
        {},
        JSON.stringify({
          name: self.$store.state.userData.crewName,
          type: global.$prop.CHAT_CONNET
        })
      );
    },
    openConnect() {
      this.debugTip = "开始连接";
      this.initWebSocket();
    },
    //滚动到最底部,已显示最新信息
    scrollToButtom() {
      this.$nextTick(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      });
    },
    //更新在线人员
    handleUserList(userList) {
      this.userList = userList.split(",");
    },
    onModelVisibleChange(show) {
      if (show) {
      } else {
        this.disconnect();
      }
    },
    random() {
      return Math.random(1000);
    },
    dataInitialize() {
      this.chatMessages = [];
      this.userList = [];
      this.debugTip = "";
    }
  }
};
</script>