<style scoped>
</style>
<template>
  <Modal v-model="show" title="回复推文">
    <Row>
      <single-message-list :curMessageItems="curMessageItems" ref="singleMessage-list"></single-message-list>
    </Row>
    <Row>
      <rich-text @on-reply-success-valid="handleNewReply" :showReplyButton="true"></rich-text>
    </Row>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import SingleMessageList from "../../components/message/single-message-list";
import RichText from "../../components/message/rich-text";
import { post } from "@/util/httpUtil.js";

export default {
  components: { SingleMessageList, RichText },
  props: {
    curMessageItems: {
      type: Object,
      default: () => {
        return {
          createTime: "300011111111"
        };
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
    handleNewReply(data) {
      post(
        global.$prop.URL.newComment,
        {
          commentatorId: data.commentatorId,
          html: data.html,
          messageId: this.curMessageItems.id,
          messageCreator: this.curMessageItems.creator,
        },
        this.replyResponse
      );
    },
    replyResponse(){
        global.$util.successNotice("回复成功");
        this.show = false;
        this.$emit("on-reply-success");
    }
  }
};
</script>