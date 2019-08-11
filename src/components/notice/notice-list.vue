<style scoped>
.noticeRow {
  font-size: 13px;
  height: 50px;
  line-height: 50px;
  border-bottom-color: rgb(230, 236, 240);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.noticeContent {
  cursor: pointer;
}
.noticeContent:hover {
  text-decoration-line: underline;
}
.jump-a {
  margin-right: 5px;
}
</style>
<template>
  <Modal v-model="show" :footer-hide="true" width="700">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>我的通知</span>
    </p>
    <Row class="noticeRow" v-for="item in noticeItems" :key="item.id">
      <strong v-if="item.isRead == 0">
        <span class="noticeContent" @click="jumpToDestination(item)">{{ item.content }}</span>
      </strong>
      <span v-else class="noticeContent" @click="jumpToDestination(item)">{{ item.content }}</span>
      <span
        style="float:right"
      >{{item.createTime.substring(0,4)}}.{{item.createTime.substring(4,6)}}.{{item.createTime.substring(6,8)}} {{item.createTime.substring(8,10)}}:{{item.createTime.substring(10,12)}}</span>
    </Row>
    <div v-if="noticeItems.length == 0" style="text-align: center">
      <img style="height: 100px;width: 100px" src="../../assets/images/null.png" />
      <div>无通知数据</div>
    </div>
  </Modal>
</template>
<script>
import { post } from "@/util/httpUtil.js";

export default {
  components: {},
  props: {
    noticeItems: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      show: false
    };
  },
  created: function() {},
  methods: {
    jumpToDestination(item) {
      //将消息改为已读
      if (item.isRead == 0) {
        post(
          global.$prop.URL.readNotice,
          {
            id: item.id
          },
          this.readNoticeResponse
        );
      }

      global.$util.routerPushForPath(item.url);
      this.show = false;
    },
    readNoticeResponse() {
      this.$emit("on-reload-request");
    }
  }
};
</script>