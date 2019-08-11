<style scoped>
.text {
  border: 1px solid rgb(29, 161, 242);
  height: 235px;
  border-radius: calc(16px);
  overflow: auto;
}
.toolbar {
  margin-bottom: 10px;
}
.placeholder {
  color: #9197a3;
  position: absolute;
  z-index: 1;
  top: 72px;
  left: 27px;
  font-size: 20px;
}

.show {
  display: block;
}

.close {
  display: none;
}

.limit {
  color: #9197a3;
  z-index: 1;
  float: right;
  margin-right: 11px;
  position: relative;
  top: -40px;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  color: black;
}
.limit-red {
  color: red;
}
.limit-normal {
}
.postButton {
  width: 10%;
  border-radius: 20px;
}
</style>
<template>
<!-- 外加一层div包裹防止vue懵逼,详情见https://www.v2ex.com/t/590284 -->
  <div>
    <Drawer title="发送推文" width="60%" placement="left" :closable="false" v-model="show">
      <rich-text @on-success-valid="handleNewMessage" :showPostButton="true"></rich-text>
    </Drawer>
  </div>
</template>
<script>
import RichText from "../../components/message/rich-text";

export default {
  components: { RichText },
  data() {
    return {
      show: false
    };
  },
  methods: {
    handleNewMessage(data) {
      this.$emit("on-success-valid", data);
    }
  }
};
</script>