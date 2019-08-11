//websocket接受器
<style scoped>
</style>
<template></template>
<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  components: {},
  data() {
    return {
      serverMsg: "",
      specifiedMsg: "",
      stompClient: null
    };
  },
  computed: {
    curUserId: function() {
      return this.$store.state.userData.id;
    }
  },
  created: function() {
    this.initWebSocket();
  },
  beforeDestroy: function() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    initWebSocket() {
      this.connection();
      let self = this;
    },
    connection() {
      let self = this;
      let url = global.$prop.DEBUG
        ? global.$prop.DEV_BASEURL + global.$prop.WEBSOCKETPATH
        : global.$prop.PROD_BASEURL + global.$prop.WEBSOCKETPATH;
      //建立连接对象
      this.socket = new SockJS(url);
      //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      // 定义客户端的认证信息,按需求配置
      var headers = {};
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          //订阅广播topic消息
          this.stompClient.subscribe(global.$prop.PRODUCERPATH, msg => {
            // 订阅服务端提供的某个topic
            let resData = global.$util.parseJson(msg.body);
            global.$util.logger("成功接受ws广播");
            global.$util.logger(resData);
          });

          //订阅通知消息
          this.stompClient.subscribe(
            global.$prop.P2PPUSHBASEPATH +
              "/" +
              self.$store.state.userData.id +
              global.$prop.P2PPUSHPATH,
            msg => {
              // 订阅服务端提供的某个topic
              let resData = global.$util.parseJson(msg.body);
              global.$util.logger("当前用户存在新通知,开始刷新");
              self.$emit("on-new-notice");
            }
          );
        },
        err => {
          // 连接发生错误时的处理函数
          global.$util.logger(err);
        }
      );
    },
    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        global.$util.logger("Disconnected");
      }
    },
    
  }
};
</script>